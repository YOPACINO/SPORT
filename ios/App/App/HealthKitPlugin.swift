import Foundation
import Capacitor
import HealthKit

// Module natif MonSport : lit TOUTES les données Apple Santé (sommeil + phases, pas,
// énergie, FC, VFC, FC repos, VO2max, poids, séances) et les renvoie au JS.
@objc(HealthKitPlugin)
public class HealthKitPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HealthKitPlugin"
    public let jsName = "HealthKit"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryAll", returnType: CAPPluginReturnPromise)
    ]

    let store = HKHealthStore()

    private func qType(_ id: HKQuantityTypeIdentifier) -> HKQuantityType? {
        return HKQuantityType.quantityType(forIdentifier: id)
    }

    private func readTypes() -> Set<HKObjectType> {
        var s = Set<HKObjectType>()
        if let t = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) { s.insert(t) }
        let ids: [HKQuantityTypeIdentifier] = [
            .stepCount, .activeEnergyBurned, .heartRate, .heartRateVariabilitySDNN,
            .restingHeartRate, .bodyMass, .vo2Max, .distanceWalkingRunning
        ]
        ids.forEach {
            if let t = qType($0) { s.insert(t) }
        }
        s.insert(HKObjectType.workoutType())
        return s
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit indisponible sur cet appareil"); return
        }
        store.requestAuthorization(toShare: nil, read: readTypes()) { ok, err in
            if let err = err { call.reject(err.localizedDescription); return }
            call.resolve(["granted": ok])
        }
    }

    // Agrégation quotidienne d'un type quantité (somme ou moyenne)
    private func daily(_ id: HKQuantityTypeIdentifier, unit: HKUnit, options: HKStatisticsOptions,
                       start: Date, end: Date, done: @escaping ([[String: Any]]) -> Void) {
        guard let t = qType(id) else { done([]); return }
        let cal = Calendar.current
        let anchor = cal.startOfDay(for: start)
        let q = HKStatisticsCollectionQuery(quantityType: t,
            quantitySamplePredicate: HKQuery.predicateForSamples(withStart: start, end: end),
            options: options, anchorDate: anchor, intervalComponents: DateComponents(day: 1))
        q.initialResultsHandler = { _, results, _ in
            var out = [[String: Any]]()
            let fmt = ISO8601DateFormatter()
            results?.enumerateStatistics(from: anchor, to: end) { stat, _ in
                var val: Double? = nil
                if options == .cumulativeSum { val = stat.sumQuantity()?.doubleValue(for: unit) }
                else { val = stat.averageQuantity()?.doubleValue(for: unit) }
                if let v = val, v > 0 {
                    out.append(["date": String(fmt.string(from: stat.startDate).prefix(10)), "value": v])
                }
            }
            done(out)
        }
        store.execute(q)
    }

    @objc func queryAll(_ call: CAPPluginCall) {
        let days = call.getInt("days") ?? 30
        let end = Date()
        let start = Calendar.current.date(byAdding: .day, value: -days, to: end) ?? end
        let fmt = ISO8601DateFormatter()
        let group = DispatchGroup()
        var result = [String: Any]()

        // Sommeil (échantillons bruts avec phase)
        if let sleepT = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
            group.enter()
            let q = HKSampleQuery(sampleType: sleepT,
                predicate: HKQuery.predicateForSamples(withStart: start, end: end),
                limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
                var arr = [[String: Any]]()
                (samples as? [HKCategorySample])?.forEach { s in
                    arr.append(["start": fmt.string(from: s.startDate),
                                "end": fmt.string(from: s.endDate),
                                "value": s.value])
                }
                result["sleep"] = arr; group.leave()
            }
            store.execute(q)
        }

        // Séances (workouts)
        group.enter()
        let wq = HKSampleQuery(sampleType: HKObjectType.workoutType(),
            predicate: HKQuery.predicateForSamples(withStart: start, end: end),
            limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
            var arr = [[String: Any]]()
            (samples as? [HKWorkout])?.forEach { w in
                arr.append([
                    "start": fmt.string(from: w.startDate),
                    "type": w.workoutActivityType.rawValue,
                    "duration": w.duration,
                    "distance": w.totalDistance?.doubleValue(for: .meter()) ?? 0,
                    "calories": w.totalEnergyBurned?.doubleValue(for: .kilocalorie()) ?? 0
                ])
            }
            result["workouts"] = arr; group.leave()
        }
        store.execute(wq)

        // Agrégats quotidiens
        group.enter(); daily(.stepCount, unit: .count(), options: .cumulativeSum, start: start, end: end) { result["steps"] = $0; group.leave() }
        group.enter(); daily(.activeEnergyBurned, unit: .kilocalorie(), options: .cumulativeSum, start: start, end: end) { result["energy"] = $0; group.leave() }
        group.enter(); daily(.heartRate, unit: HKUnit(from: "count/min"), options: .discreteAverage, start: start, end: end) { result["hr"] = $0; group.leave() }
        group.enter(); daily(.heartRateVariabilitySDNN, unit: .secondUnit(with: .milli), options: .discreteAverage, start: start, end: end) { result["hrv"] = $0; group.leave() }
        group.enter(); daily(.restingHeartRate, unit: HKUnit(from: "count/min"), options: .discreteAverage, start: start, end: end) { result["rest"] = $0; group.leave() }
        group.enter(); daily(.bodyMass, unit: .gramUnit(with: .kilo), options: .discreteAverage, start: start, end: end) { result["weight"] = $0; group.leave() }
        group.enter(); daily(.vo2Max, unit: HKUnit(from: "ml/kg*min"), options: .discreteAverage, start: start, end: end) { result["vo2"] = $0; group.leave() }

        group.notify(queue: .main) {
            call.resolve(result)
        }
    }
}
