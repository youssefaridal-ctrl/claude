package expo.modules.pbkdf2

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class ExpoPbkdf2Module : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoPbkdf2")

    AsyncFunction("pbkdf2HmacSha256") { passwordHex: String, saltHex: String, iterations: Int, keyLenBytes: Int ->
      val password = hexToBytes(passwordHex)
      val salt = hexToBytes(saltHex)
      bytesToHex(pbkdf2(password, salt, iterations, keyLenBytes))
    }
  }

  // RFC 2898 PBKDF2-HMAC-SHA256 — one block only (keyLen ≤ 32 bytes)
  private fun pbkdf2(password: ByteArray, salt: ByteArray, iterations: Int, keyLen: Int): ByteArray {
    val mac = Mac.getInstance("HmacSHA256")
    mac.init(SecretKeySpec(password, "HmacSHA256"))
    // U1 = PRF(Password, Salt || INT(1))
    mac.update(salt)
    mac.update(byteArrayOf(0, 0, 0, 1))
    var u = mac.doFinal()
    val t = u.copyOf()
    for (c in 1 until iterations) {
      u = mac.doFinal(u)
      for (j in t.indices) t[j] = (t[j].toInt() xor u[j].toInt()).toByte()
    }
    return t.copyOf(keyLen)
  }

  private fun hexToBytes(hex: String): ByteArray =
    ByteArray(hex.length / 2) { i -> hex.substring(i * 2, i * 2 + 2).toInt(16).toByte() }

  private fun bytesToHex(bytes: ByteArray): String =
    bytes.joinToString("") { "%02x".format(it) }
}
