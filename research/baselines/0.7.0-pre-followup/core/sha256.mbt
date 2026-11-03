///|
// FIPS 180-4 SHA-256. The same compression function serves whole-buffer and
// incremental APIs on every backend. Only one 64-byte pending block is retained.
fn rotr(x : UInt32, n : Int32) -> UInt32 {
  (x >> n) | (x << (32 - n))
}

///|
pub struct Sha256State {
  state : Array[UInt32]
  pending : FixedArray[Byte]
  mut used : Int32
  mut bytes : UInt64
  mut digest : String?
}

///|
#export_name("sha256_new")
pub fn sha256_new() -> Sha256State {
  let h : Array[UInt32] = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab,
    0x5be0cd19,
  ]
  {
    state: h,
    pending: FixedArray::make(64, 0),
    used: 0,
    bytes: 0UL,
    digest: None,
  }
}

///|
fn sha256_block(h : Array[UInt32], block : FixedArray[Byte]) -> Unit {
  let constants : Array[UInt32] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4,
    0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe,
    0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
    0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116,
    0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
    0xc67178f2,
  ]
  let words : Array[UInt32] = Array::make(64, 0)
  for j = 0; j < 16; j = j + 1 {
    let mut word = 0U
    for k = 0; k < 4; k = k + 1 {
      word = (word << 8) | block[j * 4 + k].to_uint()
    }
    words[j] = word
  }
  for j = 16; j < 64; j = j + 1 {
    let x = words[j - 15]
    let y = words[j - 2]
    let s0 = rotr(x, 7) ^ rotr(x, 18) ^ (x >> 3)
    let s1 = rotr(y, 17) ^ rotr(y, 19) ^ (y >> 10)
    words[j] = words[j - 16] + s0 + words[j - 7] + s1
  }
  let mut a = h[0]
  let mut b = h[1]
  let mut c = h[2]
  let mut d = h[3]
  let mut e = h[4]
  let mut f = h[5]
  let mut g = h[6]
  let mut hh = h[7]
  for j = 0; j < 64; j = j + 1 {
    let s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
    let choice = (e & f) ^ ((e ^ 0xffffffffU) & g)
    let t1 = hh + s1 + choice + constants[j] + words[j]
    let s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
    let majority = (a & b) ^ (a & c) ^ (b & c)
    let t2 = s0 + majority
    hh = g
    g = f
    f = e
    e = d + t1
    d = c
    c = b
    b = a
    a = t1 + t2
  }
  h[0] = h[0] + a
  h[1] = h[1] + b
  h[2] = h[2] + c
  h[3] = h[3] + d
  h[4] = h[4] + e
  h[5] = h[5] + f
  h[6] = h[6] + g
  h[7] = h[7] + hh
}

///|
#export_name("sha256_update")
pub fn sha256_update(context : Sha256State, data : Bytes) -> Bool {
  if context.digest is Some(_) ||
    context.bytes > 2305843009213693951UL - data.length().to_uint64() {
    return false
  }
  context.bytes = context.bytes + data.length().to_uint64()
  for byte in data {
    context.pending[context.used] = byte
    context.used = context.used + 1
    if context.used == 64 {
      sha256_block(context.state, context.pending)
      context.used = 0
    }
  }
  true
}

///|
#export_name("sha256_final")
pub fn sha256_final(context : Sha256State) -> String {
  if context.digest is Some(value) {
    return value
  }
  context.pending[context.used] = 128
  context.used = context.used + 1
  if context.used > 56 {
    for i = context.used; i < 64; i = i + 1 {
      context.pending[i] = 0
    }
    sha256_block(context.state, context.pending)
    context.used = 0
  }
  for i = context.used; i < 56; i = i + 1 {
    context.pending[i] = 0
  }
  let bits = context.bytes * 8UL
  for i = 0; i < 8; i = i + 1 {
    context.pending[56 + i] = ((bits >> ((7 - i) * 8)).to_uint() & 255U).to_byte()
  }
  sha256_block(context.state, context.pending)
  let out = StringBuilder()
  for word in context.state {
    let s = word.to_string(radix=16)
    for j = s.length(); j < 8; j = j + 1 {
      out.write_string("0")
    }
    out.write_string(s)
  }
  let digest = out.to_string()
  context.digest = Some(digest)
  digest
}

///|
pub fn sha256(data : Bytes) -> String {
  let context = sha256_new()
  ignore(sha256_update(context, data))
  sha256_final(context)
}
