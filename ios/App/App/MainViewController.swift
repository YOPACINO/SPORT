import UIKit
import Capacitor

// Contrôleur principal : enregistre explicitement le plugin natif HealthKit
// (l'enregistrement automatique ne suffit pas pour un plugin local).
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(HealthKitPlugin())
    }
}
