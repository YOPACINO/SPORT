import UIKit
import Capacitor

// ViewController principal : enregistre explicitement les plugins définis DANS l'app
// (les plugins de packages s'enregistrent seuls ; ceux du projet app, non → il faut
// les déclarer ici via capacitorDidLoad, méthode officielle Capacitor 6+).
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(HealthKitPlugin())
    }
}
