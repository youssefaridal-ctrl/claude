import ExpoModulesCore
import CommonCrypto

public class ExpoPbkdf2Module: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoPbkdf2")

    AsyncFunction("pbkdf2HmacSha256") { (passwordHex: String, saltHex: String, iterations: Int, keyLenBytes: Int) -> String in
      let password = Data(hexString: passwordHex)!
      let salt = Data(hexString: saltHex)!
      var derivedKey = Data(repeating: 0, count: keyLenBytes)

      let result = derivedKey.withUnsafeMutableBytes { derivedKeyPtr in
        password.withUnsafeBytes { passwordPtr in
          salt.withUnsafeBytes { saltPtr in
            CCKeyDerivationPBKDF(
              CCPBKDFAlgorithm(kCCPBKDF2),
              passwordPtr.baseAddress, password.count,
              saltPtr.baseAddress, salt.count,
              CCPseudoRandomAlgorithm(kCCPRFHmacAlgSHA256),
              UInt32(iterations),
              derivedKeyPtr.baseAddress, keyLenBytes
            )
          }
        }
      }

      guard result == kCCSuccess else {
        throw Exception(name: "PBKDF2Error", description: "CCKeyDerivationPBKDF failed: \(result)")
      }

      return derivedKey.hexString
    }
  }
}

private extension Data {
  init?(hexString: String) {
    let len = hexString.count / 2
    var data = Data(capacity: len)
    var index = hexString.startIndex
    for _ in 0 ..< len {
      let next = hexString.index(index, offsetBy: 2)
      guard let byte = UInt8(hexString[index ..< next], radix: 16) else { return nil }
      data.append(byte)
      index = next
    }
    self = data
  }

  var hexString: String {
    map { String(format: "%02x", $0) }.joined()
  }
}
