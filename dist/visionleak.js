function _M0DTPB4Json4Null() {}
_M0DTPB4Json4Null.prototype.$tag = 0;
const _M0DTPB4Json4Null__ = new _M0DTPB4Json4Null();
function _M0DTPB4Json4True() {}
_M0DTPB4Json4True.prototype.$tag = 1;
const _M0DTPB4Json4True__ = new _M0DTPB4Json4True();
function _M0DTPB4Json5False() {}
_M0DTPB4Json5False.prototype.$tag = 2;
const _M0DTPB4Json5False__ = new _M0DTPB4Json5False();
function _M0DTPB4Json6Number(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPB4Json6Number.prototype.$tag = 3;
function _M0DTPB4Json6String(param0) {
  this._0 = param0;
}
_M0DTPB4Json6String.prototype.$tag = 4;
function _M0DTPB4Json5Array(param0) {
  this._0 = param0;
}
_M0DTPB4Json5Array.prototype.$tag = 5;
function _M0DTPB4Json6Object(param0) {
  this._0 = param0;
}
_M0DTPB4Json6Object.prototype.$tag = 6;
const $reinterpret_view = new DataView(new ArrayBuffer(8));
function $i64_reinterpret_f64(a) {
  $reinterpret_view.setBigUint64(0, BigInt.asUintN(64, a), false);
  return $reinterpret_view.getFloat64(0, false);
}
function _M0TPC28internal7strconv9FloatInfo(param0, param1, param2) {
  this.mantissa_bits = param0;
  this.exponent_bits = param1;
  this.bias = param2;
}
function $oob() {
  throw new Error("Index out of bounds");
}
function _M0TPB13StringBuilder(param0) {
  this.val = param0;
}
function _M0TPC16string10StringView(param0, param1, param2) {
  this.str = param0;
  this.start = param1;
  this.end = param2;
}
class $PanicError extends Error {}
function $panic() {
  throw new $PanicError();
}
const _M0FPB12random__seed = () => {
  if (globalThis.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0] | 0; // Convert to signed 32
  } else {
    return Math.floor(Math.random() * 0x100000000) | 0; // Fallback to Math.random
  }
};
const _M0FPB19int__to__string__js = (x, radix) => {
  return x.toString(radix);
};
const _M0FPB20uint__to__string__js = (x, radix) => {
  return (x >>> 0).toString(radix);
};
function _M0TPB4IterGcE(param0, param1) {
  this.f = param0;
  this.size_hint = param1;
}
function _M0TPB4IterGUsRPB4JsonEE(param0, param1) {
  this.f = param0;
  this.size_hint = param1;
}
function _M0TPB9ArrayViewGyE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TPB9ArrayViewGkE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function $make_array_len_and_init(a, b) {
  const arr = new Array(a);
  arr.fill(b);
  return arr;
}
function $makebytes(a, b) {
  const arr = new Uint8Array(a);
  if (b !== 0) {
    arr.fill(b);
  }
  return arr;
}
function _M0TPB8MutLocalGiE(param0) {
  this.val = param0;
}
function $compare_int(a, b) {
  return (a >= b) - (a <= b);
}
const _M0MPB7JSArray4push = (arr, val) => { arr.push(val); };
function _M0TPB4IterGsE(param0, param1) {
  this.f = param0;
  this.size_hint = param1;
}
function _M0TPB4IterGRPC16string10StringViewE(param0, param1) {
  this.f = param0;
  this.size_hint = param1;
}
function _M0TPB8MutLocalGORPC16string10StringViewE(param0) {
  this.val = param0;
}
function _M0TPB3MapGsRPB4JsonE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGsbE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGsiE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGibE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGiRPB5ArrayGsEE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGsRPB5ArrayGiEE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGiiE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB3MapGiRPB5ArrayGiEE(param0, param1, param2, param3, param4, param5, param6) {
  this.entries = param0;
  this.size = param1;
  this.capacity = param2;
  this.capacity_mask = param3;
  this.grow_at = param4;
  this.head = param5;
  this.tail = param6;
}
function _M0TPB5EntryGsRPB4JsonE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGsbE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGsiE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGibE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGiRPB5ArrayGsEE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGssE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGiiE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGsRPB5ArrayGiEE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0TPB5EntryGiRPB5ArrayGiEE(param0, param1, param2, param3, param4, param5) {
  this.prev = param0;
  this.next = param1;
  this.psl = param2;
  this.hash = param3;
  this.key = param4;
  this.value = param5;
}
function _M0DTPC16option6OptionGRPB5ArrayGsEE4None() {}
_M0DTPC16option6OptionGRPB5ArrayGsEE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRPB5ArrayGsEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGsEE4None();
function _M0DTPC16option6OptionGRPB5ArrayGsEE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRPB5ArrayGsEE4Some.prototype.$tag = 1;
function _M0DTPC16option6OptionGRPB5ArrayGiEE4None() {}
_M0DTPC16option6OptionGRPB5ArrayGiEE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRPB5ArrayGiEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGiEE4None();
function _M0DTPC16option6OptionGRPB5ArrayGiEE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRPB5ArrayGiEE4Some.prototype.$tag = 1;
function _M0TPB8MutLocalGORPB5EntryGsRPB4JsonEE(param0) {
  this.val = param0;
}
function _M0TPB8MutLocalGORPB5EntryGiRPB5ArrayGsEEE(param0) {
  this.val = param0;
}
const _M0MPB7JSArray4copy = (arr) => arr.slice(0);
const $bytes_literal$0 = new Uint8Array();
const _M0MPB7JSArray3pop = (arr) => arr.pop();
function _M0TPB12MutArrayViewGsE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function $compare_uint64(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
function _M0TPB12MutArrayViewGUmsEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
const _M0FPC28encoding4utf816encode__utf8__js = (() => {
   const encoder = new TextEncoder();
   return function(src, start, len, bom) {
     const end = start + len;
     const encoded = encoder.encode(src.slice(start, end));
     if (!bom) {
       return encoded;
     }
     const result = new Uint8Array(encoded.length + 3);
     result[0] = 0xEF;
     result[1] = 0xBB;
     result[2] = 0xBF;
     result.set(encoded, 3);
     return result;
   };
 })();
function _M0DTPC16result6ResultGuRPB7FailureE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRPB7FailureE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGuRPB7FailureE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRPB7FailureE2Ok.prototype.$tag = 1;
function _M0DTPC15error5Error52moonbitlang_2fcore_2fjson_2eParseError_2eInvalidChar(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPC15error5Error52moonbitlang_2fcore_2fjson_2eParseError_2eInvalidChar.prototype.$tag = 5;
function _M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof() {}
_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof.prototype.$tag = 4;
const _M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__ = new _M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof();
function _M0DTPC15error5Error54moonbitlang_2fcore_2fjson_2eParseError_2eInvalidNumber(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPC15error5Error54moonbitlang_2fcore_2fjson_2eParseError_2eInvalidNumber.prototype.$tag = 3;
function _M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eInvalidIdentEscape(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eInvalidIdentEscape.prototype.$tag = 2;
function _M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eDepthLimitExceeded() {}
_M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eDepthLimitExceeded.prototype.$tag = 1;
const _M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eDepthLimitExceeded__ = new _M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eDepthLimitExceeded();
function _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure.prototype.$tag = 0;
function _M0DTPC16result6ResultGdRPB7FailureE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGdRPB7FailureE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGdRPB7FailureE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGdRPB7FailureE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGRPC16string10StringViewRPB7FailureE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC16string10StringViewRPB7FailureE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPC16string10StringViewRPB7FailureE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC16string10StringViewRPB7FailureE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok.prototype.$tag = 1;
function _M0TPC28internal7strconv6Number(param0, param1, param2, param3) {
  this.exponent = param0;
  this.mantissa = param1;
  this.negative = param2;
  this.many_digits = param3;
}
function _M0DTPC16result6ResultGdRPC15error5ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGdRPC15error5ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGdRPC15error5ErrorE2Ok.prototype.$tag = 1;
function $i64_clz(a) {
  a = BigInt.asUintN(64, a);
  if (a === 0n) return 64;
  const hi = Number(a >> 32n);
  if (hi !== 0) {
    return Math.clz32(hi);
  }
  return 32 + Math.clz32(Number(a & 0xffffffffn));
}
function _M0TPC28internal7strconv12EiselProduct(param0, param1) {
  this.lo = param0;
  this.hi = param1;
}
function _M0TPC28internal7strconv7Decimal(param0, param1, param2, param3, param4, param5) {
  this.digits = param0;
  this.digits_num = param1;
  this.decimal_point = param2;
  this.negative = param3;
  this.truncated = param4;
  this.overflowed = param5;
}
function _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE2Ok.prototype.$tag = 1;
function $f64_convert_i64_u(a) {
  return Number(a);
}
function _M0DTPC16option6OptionGdE4None() {}
_M0DTPC16option6OptionGdE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGdE4None__ = new _M0DTPC16option6OptionGdE4None();
function _M0DTPC16option6OptionGdE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGdE4Some.prototype.$tag = 1;
function _M0TPC14json8Position(param0, param1) {
  this.line = param0;
  this.column = param1;
}
function _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGuRPC14json10ParseErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRPC14json10ParseErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGuRPC14json10ParseErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRPC14json10ParseErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGiRPC14json10ParseErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGiRPC14json10ParseErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGiRPC14json10ParseErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGiRPC14json10ParseErrorE2Ok.prototype.$tag = 1;
function _M0TPC14json12ParseContext(param0, param1, param2) {
  this.offset = param0;
  this.input = param1;
  this.end_offset = param2;
}
function $f64_convert_i64(a) {
  return Number(BigInt.asIntN(64, a));
}
function _M0TPC14json11LexedNumber(param0, param1) {
  this.repr = param0;
  this.value = param1;
}
function _M0TPC14json14JsonNumberScan(param0, param1, param2, param3, param4) {
  this.negative = param0;
  this.is_integer = param1;
  this.mantissa = param2;
  this.exponent = param3;
  this.many_digits = param4;
}
function _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGsRPC14json10ParseErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGsRPC14json10ParseErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok.prototype.$tag = 1;
function _M0DTPC14json5Token4Null() {}
_M0DTPC14json5Token4Null.prototype.$tag = 0;
const _M0DTPC14json5Token4Null__ = new _M0DTPC14json5Token4Null();
function _M0DTPC14json5Token4True() {}
_M0DTPC14json5Token4True.prototype.$tag = 1;
const _M0DTPC14json5Token4True__ = new _M0DTPC14json5Token4True();
function _M0DTPC14json5Token5False() {}
_M0DTPC14json5Token5False.prototype.$tag = 2;
const _M0DTPC14json5Token5False__ = new _M0DTPC14json5Token5False();
function _M0DTPC14json5Token6Number(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPC14json5Token6Number.prototype.$tag = 3;
function _M0DTPC14json5Token6String(param0) {
  this._0 = param0;
}
_M0DTPC14json5Token6String.prototype.$tag = 4;
function _M0DTPC14json5Token6LBrace() {}
_M0DTPC14json5Token6LBrace.prototype.$tag = 5;
const _M0DTPC14json5Token6LBrace__ = new _M0DTPC14json5Token6LBrace();
function _M0DTPC14json5Token6RBrace() {}
_M0DTPC14json5Token6RBrace.prototype.$tag = 6;
const _M0DTPC14json5Token6RBrace__ = new _M0DTPC14json5Token6RBrace();
function _M0DTPC14json5Token8LBracket() {}
_M0DTPC14json5Token8LBracket.prototype.$tag = 7;
const _M0DTPC14json5Token8LBracket__ = new _M0DTPC14json5Token8LBracket();
function _M0DTPC14json5Token8RBracket() {}
_M0DTPC14json5Token8RBracket.prototype.$tag = 8;
const _M0DTPC14json5Token8RBracket__ = new _M0DTPC14json5Token8RBracket();
function _M0DTPC14json5Token5Comma() {}
_M0DTPC14json5Token5Comma.prototype.$tag = 9;
const _M0DTPC14json5Token5Comma__ = new _M0DTPC14json5Token5Comma();
function _M0TPB9ArrayViewGUsRPB4JsonEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0DTPC14json10WriteFrame5Array(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPC14json10WriteFrame5Array.prototype.$tag = 0;
function _M0DTPC14json10WriteFrame6Object(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPC14json10WriteFrame6Object.prototype.$tag = 1;
function _M0TPB9ArrayViewGUsbEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TP36cjyhjy10visionleak4core11Sha256State(param0, param1, param2, param3, param4) {
  this.state = param0;
  this.pending = param1;
  this.used = param2;
  this.bytes = param3;
  this.digest = param4;
}
function _M0TPB9ArrayViewGUsiEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TPB9ArrayViewGUibEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TPB9ArrayViewGUiRPB5ArrayGsEEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TPB9ArrayViewGUssEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TP36cjyhjy10visionleak4core16PixelDigestState(param0, param1, param2, param3, param4, param5, param6, param7) {
  this.hash = param0;
  this.width = param1;
  this.height = param2;
  this.expected = param3;
  this.pixels = param4;
  this.low = param5;
  this.high = param6;
  this.valid = param7;
}
function _M0TP36cjyhjy10visionleak4core8MihIndex(param0, param1) {
  this.buckets = param0;
  this.parents = param1;
}
function _M0TPB9ArrayViewGUiRPB5ArrayGiEEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function $i32_popcnt(a) {
  a = a - ((a >>> 1) & 0x55555555);
  a = (a & 0x33333333) + ((a >>> 2) & 0x33333333);
  a = (a + (a >>> 4)) & 0x0f0f0f0f;
  a = a + (a >>> 8);
  a = a + (a >>> 16);
  return a & 0x3f;
}
function _M0TP36cjyhjy10visionleak4core9LocalNode(param0, param1, param2) {
  this.hash = param0;
  this.members = param1;
  this.children = param2;
}
function _M0TPB9ArrayViewGUiiEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TP36cjyhjy10visionleak4core6Hash64(param0, param1) {
  this.high = param0;
  this.low = param1;
}
function _M0TPB9ArrayViewGUsRPB5ArrayGiEEE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TP36cjyhjy10visionleak4core6Budget(param0, param1, param2, param3, param4, param5) {
  this.maximum = param0;
  this.work = param1;
  this.distances = param2;
  this.index_work = param3;
  this.pair_checks = param4;
  this.reason = param5;
}
function _M0TP36cjyhjy10visionleak4core6BkNode(param0, param1, param2) {
  this.hash = param0;
  this.members = param1;
  this.children = param2;
}
function _M0TP36cjyhjy10visionleak4core4Item(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9) {
  this.id = param0;
  this.split = param1;
  this.bytes = param2;
  this.pixels = param3;
  this.hash = param4;
  this.mirror_hash = param5;
  this.orientation_hashes = param6;
  this.contrast = param7;
  this.local_hashes = param8;
  this.local_contrasts = param9;
}
const _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger = { method_0: _M0IPB13StringBuilderPB6Logger13write__string, method_1: _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE, method_2: _M0IPB13StringBuilderPB6Logger11write__view, method_3: _M0IPB13StringBuilderPB6Logger11write__char, method_4: _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE, method_5: _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE };
const _M0FPB4null = _M0DTPB4Json4Null__;
const _M0MPB4Iter4nextN6constrS120GcE = 0;
const _M0MPB4Iter4nextN6constrS121GcE = 0;
const _M0MPB4Iter4nextN6constrS128GUsRPB4JsonEE = 0;
const _M0MPB4Iter4nextN6constrS129GUsRPB4JsonEE = 0;
const _M0MPB4Iter3newN6constrS172GcE = 0;
const _M0MPB4Iter3newN6constrS178GUsRPB4JsonEE = 0;
const _M0FPC16double14not__a__number = $i64_reinterpret_f64(9221120237041090561n);
const _M0FPC16double8infinity = $i64_reinterpret_f64(9218868437227405312n);
const _M0FPC16double13neg__infinity = $i64_reinterpret_f64(18442240474082181120n);
const _M0FPC28internal7strconv15range__err__str = "value out of range";
const _M0FPC28internal7strconv16syntax__err__str = "invalid syntax";
const _M0FPC28internal7strconv17min__19digit__int = 1000000000000000000n;
const _M0FPC28internal7strconv27eisel__lemire__pow10__table = [18054884314459144840n, 1671618768450675795n, 11284302696536965525n, 1044761730281672372n, 14105378370671206906n, 5917638181279478369n, 17631722963339008632n, 16620419763454123769n, 11019826852086880395n, 10387762352158827356n, 13774783565108600494n, 8373016921771146291n, 17218479456385750618n, 1242899115359157055n, 10761549660241094136n, 5388497965526861063n, 13451937075301367670n, 6735622456908576329n, 16814921344126709587n, 17642900107990496220n, 10509325840079193492n, 8720969558280366185n, 13136657300098991865n, 10901211947850457732n, 16420821625123739831n, 18238200953240460069n, 10263013515702337394n, 18316404623416369399n, 12828766894627921743n, 13672133742415685941n, 16035958618284902179n, 12478481159592219522n, 10022474136428063862n, 5493207715531443249n, 12528092670535079827n, 16089881681269079869n, 15660115838168849784n, 15500666083158961933n, 9787572398855531115n, 9687916301974351208n, 12234465498569413894n, 7498209359040551106n, 15293081873211767368n, 149389661945913074n, 9558176170757354605n, 93368538716195671n, 11947720213446693256n, 4728396691822632493n, 14934650266808366570n, 5910495864778290617n, 9334156416755229106n, 8305745933913819539n, 11667695520944036383n, 1158810380537498616n, 14584619401180045478n, 15283571030954036982n, 18230774251475056848n, 9881091751837770420n, 11394233907171910530n, 6175682344898606512n, 14242792383964888162n, 16942974967978033949n, 17803490479956110203n, 11955346673117766628n, 11127181549972568877n, 5166248661484910190n, 13908976937465711096n, 11069496845283525642n, 17386221171832138870n, 13836871056604407053n, 10866388232395086794n, 4036358391950366504n, 13582985290493858492n, 14268820026792733938n, 16978731613117323115n, 17836025033490917422n, 10611707258198326947n, 8841672636718129437n, 13264634072747908684n, 6440404777470273892n, 16580792590934885855n, 8050505971837842365n, 10362995369334303659n, 11949095260039733334n, 12953744211667879574n, 10324683056622278764n, 16192180264584849468n, 3682481783923072647n, 10120112665365530917n, 11524923151806696212n, 12650140831706913647n, 571095884476206553n, 15812676039633642058n, 14548927910877421904n, 9882922524771026286n, 13704765962725776594n, 12353653155963782858n, 7907585416552444934n, 15442066444954728573n, 661109733835780360n, 9651291528096705358n, 2719036592861056677n, 12064114410120881697n, 12622167777931096654n, 15080143012651102122n, 1942651667131707105n, 9425089382906938826n, 5825843310384704845n, 11781361728633673532n, 16505676174835656864n, 14726702160792091916n, 2185351144835019464n, 18408377700990114895n, 2731688931043774330n, 11505236063118821809n, 8624834609543440812n, 14381545078898527261n, 15392729280356688919n, 17976931348623159077n, 5405853545163697437n, 11235582092889474423n, 5684501474941004850n, 14044477616111843029n, 2493940825248868159n, 17555597020139803786n, 7729112049988473103n, 10972248137587377366n, 9442381049670183593n, 13715310171984221708n, 2579604275232953683n, 17144137714980277135n, 3224505344041192104n, 10715086071862673209n, 8932844867666826921n, 13393857589828341511n, 15777742103010921555n, 16742321987285426889n, 15110491610336264040n, 10463951242053391806n, 2526528228819083169n, 13079939052566739757n, 12381532322878629770n, 16349923815708424697n, 1641857348316123500n, 10218702384817765435n, 12555375888766046947n, 12773377981022206794n, 11082533842530170780n, 15966722476277758493n, 4629795266307937667n, 9979201547673599058n, 5199465050656154994n, 12474001934591998822n, 15722703350174969551n, 15592502418239998528n, 10430007150863936130n, 9745314011399999080n, 6518754469289960081n, 12181642514249998850n, 8148443086612450102n, 15227053142812498563n, 962181821410786819n, 9516908214257811601n, 16742264702877599426n, 11896135267822264502n, 7092772823314835570n, 14870169084777830627n, 18089338065998320271n, 9293855677986144142n, 8999993282035256217n, 11617319597482680178n, 2026619565689294464n, 14521649496853350222n, 11756646493966393888n, 18152061871066687778n, 5472436080603216552n, 11345038669416679861n, 8031958568804398249n, 14181298336770849826n, 14651634229432885715n, 17726622920963562283n, 9091170749936331336n, 11079139325602226427n, 3376138709496513133n, 13848924157002783033n, 18055231442152805128n, 17311155196253478792n, 8733981247408842698n, 10819471997658424245n, 5458738279630526686n, 13524339997073030306n, 11435108867965546262n, 16905424996341287883n, 5070514048102157020n, 10565890622713304927n, 863228270850154185n, 13207363278391631158n, 14914093393844856443n, 16509204097989538948n, 9419244705451294746n, 10318252561243461842n, 15110399977761835024n, 12897815701554327303n, 9664627935347517973n, 16122269626942909129n, 7469098900757009562n, 10076418516839318205n, 16197401859041600736n, 12595523146049147757n, 6411694268519837208n, 15744403932561434696n, 12626303854077184414n, 9840252457850896685n, 7891439908798240259n, 12300315572313620856n, 14475985904425188227n, 15375394465392026070n, 18094982380531485284n, 9609621540870016294n, 6697677969404790399n, 12012026926087520367n, 17595469498610763806n, 15015033657609400459n, 17382650854836066854n, 9384396036005875287n, 8558313775058847832n, 11730495045007344109n, 6086206200396171886n, 14663118806259180136n, 12219443768922602761n, 18328898507823975170n, 15274304711153253452n, 11455561567389984481n, 14158126462898171311n, 14319451959237480602n, 3862600023340550427n, 17899314949046850752n, 14051622066030463842n, 11187071843154281720n, 8782263791269039901n, 13983839803942852150n, 10977829739086299876n, 17479799754928565188n, 4498915137003099037n, 10924874846830353242n, 12035193997481712706n, 13656093558537941553n, 5820620459997365075n, 17070116948172426941n, 11887461593424094248n, 10668823092607766838n, 9735506505103752857n, 13336028865759708548n, 2946011094524915263n, 16670036082199635685n, 3682513868156144079n, 10418772551374772303n, 4607414176811284001n, 13023465689218465379n, 1147581702586717097n, 16279332111523081723n, 15269535183515560084n, 10174582569701926077n, 7237616480483531100n, 12718228212127407596n, 13658706619031801779n, 15897785265159259495n, 17073383273789752224n, 9936115790724537184n, 17588393573759676996n, 12420144738405671481n, 3538747893490044629n, 15525180923007089351n, 9035120885289943691n, 9703238076879430844n, 12564479580947296663n, 12129047596099288555n, 15705599476184120828n, 15161309495124110694n, 15020313326802763131n, 9475818434452569184n, 4776009810824339053n, 11844773043065711480n, 5970012263530423816n, 14805966303832139350n, 7462515329413029771n, 9253728939895087094n, 52386062455755702n, 11567161174868858867n, 9288854614924470436n, 14458951468586073584n, 6999382250228200141n, 18073689335732591980n, 8749227812785250177n, 11296055834832869987n, 14691639419845557168n, 14120069793541087484n, 13752863256379558556n, 17650087241926359355n, 17191079070474448196n, 11031304526203974597n, 8438581409832836170n, 13789130657754968246n, 15159912780718433117n, 17236413322193710308n, 9726518939043265588n, 10772758326371068942n, 15302446373756816800n, 13465947907963836178n, 9904685930341245193n, 16832434884954795223n, 3157485376071780683n, 10520271803096747014n, 8890957387685944783n, 13150339753870933768n, 1890324697752655170n, 16437924692338667210n, 2362905872190818963n, 10273702932711667006n, 6088502188546649756n, 12842128665889583757n, 16833999772538088003n, 16052660832361979697n, 7207441660390446292n, 10032913020226237310n, 16033866083812498692n, 12541141275282796638n, 10818960567910847557n, 15676426594103495798n, 4300328673033783639n, 9797766621314684873n, 16522763475928278486n, 12247208276643356092n, 6818396289628184396n, 15309010345804195115n, 8522995362035230495n, 9568131466127621947n, 3021029092058325107n, 11960164332659527433n, 17611344420355070096n, 14950205415824409292n, 8179122470161673908n, 9343878384890255807n, 14335323580705822000n, 11679847981112819759n, 13307468457454889596n, 14599809976391024699n, 12022649553391224092n, 18249762470488780874n, 10416625923311642211n, 11406101544055488046n, 11122077220497164286n, 14257626930069360058n, 4679224488766679549n, 17822033662586700072n, 15072402647813125244n, 11138771039116687545n, 9420251654883203278n, 13923463798895859431n, 16387000587031392001n, 17404329748619824289n, 15872064715361852097n, 10877706092887390181n, 3002511419460075705n, 13597132616109237726n, 8364825292752482535n, 16996415770136547158n, 1232659579085827361n, 10622759856335341973n, 14605470292210805812n, 13278449820419177467n, 4421779809981343554n, 16598062275523971834n, 915538744049291538n, 10373788922202482396n, 5183897733458195115n, 12967236152753102995n, 6479872166822743894n, 16209045190941378744n, 3488154190101041964n, 10130653244338361715n, 2180096368813151227n, 12663316555422952143n, 16560178516298602746n, 15829145694278690179n, 16088537126945865529n, 9893216058924181362n, 7749492695127472003n, 12366520073655226703n, 463493832054564196n, 15458150092069033378n, 14414425345350368957n, 9661343807543145861n, 13620701859271368502n, 12076679759428932327n, 3190819268807046916n, 15095849699286165408n, 17823582141290972357n, 9434906062053853380n, 11139738838306857723n, 11793632577567316725n, 13924673547883572154n, 14742040721959145907n, 3570783879572301480n, 18427550902448932383n, 18298537904747540562n, 11517219314030582739n, 18354115218108294707n, 14396524142538228424n, 18330958004207980480n, 17995655178172785531n, 4466953431550423984n, 11247284486357990957n, 486002885505321038n, 14059105607947488696n, 5219189625309039202n, 17573882009934360870n, 6523987031636299002n, 10983676256208975543n, 17912549950054850588n, 13729595320261219429n, 17779001419141175331n, 17161994150326524287n, 8388693718644305452n, 10726246343954077679n, 12160462601793772764n, 13407807929942597099n, 10588892233814828051n, 16759759912428246374n, 8624429273841147159n, 10474849945267653984n, 778582277723329070n, 13093562431584567480n, 973227847154161338n, 16366953039480709350n, 1216534808942701673n, 10229345649675443343n, 14595392310871352257n, 12786682062094304179n, 13632554370161802418n, 15983352577617880224n, 12429006944274865118n, 9989595361011175140n, 7768129340171790699n, 12486994201263968925n, 9710161675214738374n, 15608742751579961156n, 16749388112445810871n, 9755464219737475723n, 1244995533423855986n, 12194330274671844653n, 15391302472061983695n, 15242912843339805817n, 5404070034795315907n, 9526820527087378635n, 14906758817815542202n, 11908525658859223294n, 14021762503842039848n, 14885657073574029118n, 8303831092947774002n, 9303535670983768199n, 578208414664970847n, 11629419588729710248n, 14557818573613377271n, 14536774485912137810n, 18197273217016721589n, 18170968107390172263n, 13523219484416126178n, 11356855067118857664n, 15369541205401160717n, 14196068833898572081n, 765182433041899281n, 17745086042373215101n, 5568164059729762005n, 11090678776483259438n, 5785945546544795205n, 13863348470604074297n, 16455803970035769814n, 17329185588255092872n, 6734696907262548556n, 10830740992659433045n, 4209185567039092847n, 13538426240824291306n, 9873167977226253963n, 16923032801030364133n, 3118087934678041646n, 10576895500643977583n, 4254647968387469981n, 13221119375804971979n, 706623942056949572n, 16526399219756214973n, 14718337982853350677n, 10328999512347634358n, 11504804248497038125n, 12911249390434542948n, 5157633273766521849n, 16139061738043178685n, 6447041592208152311n, 10086913586276986678n, 6335244004343789146n, 12608641982846233347n, 17142427042284512241n, 15760802478557791684n, 16816347784428252397n, 9850501549098619803n, 1286845328412881940n, 12313126936373274753n, 15443614715798266137n, 15391408670466593442n, 5469460339465668959n, 9619630419041620901n, 8030098730593431003n, 12024538023802026126n, 14649309431669176658n, 15030672529752532658n, 9088264752731695015n, 9394170331095332911n, 10291851488884697288n, 11742712913869166139n, 8253128342678483706n, 14678391142336457674n, 5704724409920716729n, 18347988927920572092n, 16354277549255671720n, 11467493079950357558n, 998051431430019017n, 14334366349937946947n, 10470936326142299579n, 17917957937422433684n, 8476984389250486570n, 11198723710889021052n, 14521487280136329914n, 13998404638611276315n, 18151859100170412392n, 17498005798264095394n, 18078137856785627587n, 10936253623915059621n, 15910522178918405146n, 13670317029893824527n, 6053094668365842720n, 17087896287367280659n, 2954682317029915496n, 10679935179604550411n, 17987577512639554849n, 13349918974505688014n, 17872785872372055657n, 16687398718132110018n, 13117610303610293764n, 10429624198832568761n, 12810192458183821506n, 13037030248540710952n, 2177682517447613171n, 16296287810675888690n, 2722103146809516464n, 10185179881672430431n, 6313000485183335694n, 12731474852090538039n, 3279564588051781713n, 15914343565113172548n, 17934513790346890853n, 9946464728195732843n, 1985699082112030975n, 12433080910244666053n, 16317181907922202431n, 15541351137805832567n, 6561419329620589327n, 9713344461128645354n, 11018416108653950185n, 12141680576410806693n, 4549648098962661924n, 15177100720513508366n, 10298746142130715309n, 9485687950320942729n, 1825030320404309164n, 11857109937901178411n, 6892973918932774359n, 14821387422376473014n, 4004531380238580045n, 9263367138985295633n, 16337890167931276240n, 11579208923731619542n, 6587304654631931588n, 14474011154664524427n, 17457502855144690293n, 18092513943330655534n, 17210192550503474962n, 11307821214581659709n, 6144684325637283947n, 14134776518227074636n, 12292541425473992838n, 17668470647783843295n, 15365676781842491048n, 11042794154864902059n, 16521077016292638761n, 13803492693581127574n, 16039660251938410547n, 17254365866976409468n, 10826203278068237376n, 10783978666860255917n, 15989749085647424168n, 13479973333575319897n, 6152128301777116498n, 16849966666969149871n, 12301846395648783526n, 10531229166855718669n, 14606183024921571560n, 13164036458569648337n, 4422670725869800738n, 16455045573212060421n, 10140024425764638826n, 10284403483257537763n, 8643358275316593218n, 12855504354071922204n, 6192511825718353619n, 16069380442589902755n, 7740639782147942024n, 10043362776618689222n, 2532056854628769813n, 12554203470773361527n, 12388443105140738074n, 15692754338466701909n, 10873867862998534689n, 9807971461541688693n, 9102010423587778132n, 12259964326927110866n, 15989199047912110569n, 15324955408658888583n, 10763126773035362404n, 9578097130411805364n, 13644483260788183358n, 11972621413014756705n, 17055604075985229198n, 14965776766268445882n, 7484447039699372786n, 9353610478917778676n, 9289465418239495895n, 11692013098647223345n, 11611831772799369869n, 14615016373309029182n, 679731660717048624n, 18268770466636286477n, 10073036612751086588n, 11417981541647679048n, 8601490892183123069n, 14272476927059598810n, 10751863615228903837n, 17840596158824498513n, 4216457482181353988n, 11150372599265311570n, 14164500972431816002n, 13937965749081639463n, 8482254178684994195n, 17422457186352049329n, 5991131704928854840n, 10889035741470030830n, 15273672361649004035n, 13611294676837538538n, 9868718415206479236n, 17014118346046923173n, 3112525982153323237n, 10633823966279326983n, 4251171748059520975n, 13292279957849158729n, 702278666647013314n, 16615349947311448411n, 5489534351736154547n, 10384593717069655257n, 1125115960621402640n, 12980742146337069071n, 6018080969204141204n, 16225927682921336339n, 2910915193077788601n, 10141204801825835211n, 17960223060169475539n, 12676506002282294014n, 17838592806784456520n, 15845632502852867518n, 13074868971625794843n, 9903520314283042199n, 3560107088838733872n, 12379400392853802748n, 18285191916330581053n, 15474250491067253436n, 4409745821703674700n, 9671406556917033397n, 11979463175419572495n, 12089258196146291747n, 1139270913992301907n, 15111572745182864683n, 15259146697772541096n, 9444732965739290427n, 7231123676894144233n, 11805916207174113034n, 4427218577690292387n, 14757395258967641292n, 14757395258967641292n, 9223372036854775808n, 0n, 11529215046068469760n, 0n, 14411518807585587200n, 0n, 18014398509481984000n, 0n, 11258999068426240000n, 0n, 14073748835532800000n, 0n, 17592186044416000000n, 0n, 10995116277760000000n, 0n, 13743895347200000000n, 0n, 17179869184000000000n, 0n, 10737418240000000000n, 0n, 13421772800000000000n, 0n, 16777216000000000000n, 0n, 10485760000000000000n, 0n, 13107200000000000000n, 0n, 16384000000000000000n, 0n, 10240000000000000000n, 0n, 12800000000000000000n, 0n, 16000000000000000000n, 0n, 10000000000000000000n, 0n, 12500000000000000000n, 0n, 15625000000000000000n, 0n, 9765625000000000000n, 0n, 12207031250000000000n, 0n, 15258789062500000000n, 0n, 9536743164062500000n, 0n, 11920928955078125000n, 0n, 14901161193847656250n, 0n, 9313225746154785156n, 4611686018427387904n, 11641532182693481445n, 5764607523034234880n, 14551915228366851806n, 11817445422220181504n, 18189894035458564758n, 5548434740920451072n, 11368683772161602973n, 17302829768357445632n, 14210854715202003717n, 7793479155164643328n, 17763568394002504646n, 14353534962383192064n, 11102230246251565404n, 4359273333062107136n, 13877787807814456755n, 5449091666327633920n, 17347234759768070944n, 2199678564482154496n, 10842021724855044340n, 1374799102801346560n, 13552527156068805425n, 1718498878501683200n, 16940658945086006781n, 6759809616554491904n, 10587911840678754238n, 6530724019560251392n, 13234889800848442797n, 17386777061305090048n, 16543612251060553497n, 7898413271349198848n, 10339757656912845935n, 16465723340661719040n, 12924697071141057419n, 15970468157399760896n, 16155871338926321774n, 15351399178322313216n, 10097419586828951109n, 4982938468024057856n, 12621774483536188886n, 10840359103457460224n, 15777218104420236108n, 4327076842467049472n, 9860761315262647567n, 11927795063396681728n, 12325951644078309459n, 10298057810818464256n, 15407439555097886824n, 8260886245095692416n, 9629649721936179265n, 5163053903184807760n, 12037062152420224081n, 11065503397408397604n, 15046327690525280101n, 18443565265187884909n, 9403954806578300063n, 13833071299956122020n, 11754943508222875079n, 12679653106517764621n, 14693679385278593849n, 11237880364719817872n, 18367099231598242312n, 212292400617608628n, 11479437019748901445n, 132682750386005392n, 14349296274686126806n, 4777539456409894645n, 17936620343357658507n, 15195296357367144114n, 11210387714598536567n, 7191217214140771119n, 14012984643248170709n, 4377335499248575995n, 17516230804060213386n, 10083355392488107898n, 10947644252537633366n, 10913783138732455340n, 13684555315672041708n, 4418856886560793367n, 17105694144590052135n, 5523571108200991709n, 10691058840368782584n, 10369760970266701674n, 13363823550460978230n, 12962201212833377092n, 16704779438076222788n, 6979379479186945558n, 10440487148797639242n, 13585484211346616781n, 13050608935997049053n, 7758483227328495169n, 16313261169996311316n, 14309790052588006865n, 10195788231247694572n, 18166990819722280098n, 12744735289059618216n, 4261994450943298507n, 15930919111324522770n, 5327493063679123134n, 9956824444577826731n, 7941369183226839863n, 12446030555722283414n, 5315025460606161924n, 15557538194652854267n, 15867153862612478214n, 9723461371658033917n, 7611128154919104931n, 12154326714572542396n, 14125596212076269068n, 15192908393215677995n, 17656995265095336336n, 9495567745759798747n, 8729779031470891258n, 11869459682199748434n, 6300537770911226168n, 14836824602749685542n, 17099044250493808518n, 9273015376718553464n, 6075216638131242420n, 11591269220898191830n, 7594020797664053025n, 14489086526122739788n, 269153960225290473n, 18111358157653424735n, 336442450281613091n, 11319598848533390459n, 7127805559067090038n, 14149498560666738074n, 4298070930406474644n, 17686873200833422592n, 14595960699862869113n, 11054295750520889120n, 9122475437414293195n, 13817869688151111400n, 11403094296767866494n, 17272337110188889250n, 14253867870959833118n, 10795210693868055781n, 13520353437777283602n, 13494013367335069727n, 3065383741939440791n, 16867516709168837158n, 17666787732706464701n, 10542197943230523224n, 6430056314514152534n, 13177747429038154030n, 8037570393142690668n, 16472184286297692538n, 823590954573587527n, 10295115178936057836n, 5126430365035880108n, 12868893973670072295n, 6408037956294850135n, 16086117467087590369n, 3398361426941174765n, 10053823416929743980n, 13653190937906703988n, 12567279271162179975n, 17066488672383379985n, 15709099088952724969n, 16721424822051837077n, 9818186930595453106n, 3533361486141316317n, 12272733663244316382n, 13640073894531421205n, 15340917079055395478n, 7826720331309500698n, 9588073174409622174n, 280014188641050032n, 11985091468012027717n, 9573389772656088348n, 14981364335015034646n, 16578423234247498339n, 9363352709384396654n, 5749828502977298558n, 11704190886730495817n, 16410657665576399005n, 14630238608413119772n, 6678264026688335045n, 18287798260516399715n, 8347830033360418806n, 11429873912822749822n, 2911550761636567802n, 14287342391028437277n, 12862810488900485560n, 17859177988785546597n, 2243455055843443238n, 11161986242990966623n, 3708002419115845976n, 13952482803738708279n, 23317005467419566n, 17440603504673385348n, 13864204312116438170n, 10900377190420865842n, 17888499731927549664n, 13625471488026082303n, 13137252628054661272n, 17031839360032602879n, 11809879766640938686n, 10644899600020376799n, 14298703881791668535n, 13306124500025470999n, 13261693833812197764n, 16632655625031838749n, 11965431273837859301n, 10395409765644899218n, 9784237555362356015n, 12994262207056124023n, 3006924907348169211n, 16242827758820155028n, 17593714189467375226n, 10151767349262596893n, 1772699331562333708n, 12689709186578246116n, 6827560182880305039n, 15862136483222807645n, 8534450228600381299n, 9913835302014254778n, 7639874402088932264n, 12392294127517818473n, 326470965756389522n, 15490367659397273091n, 5019774725622874806n, 9681479787123295682n, 831516194300602802n, 12101849733904119602n, 10262767279730529310n, 15127312167380149503n, 3605087062808385830n, 9454570104612593439n, 9170708441896323000n, 11818212630765741799n, 6851699533943015846n, 14772765788457177249n, 3952938399001381903n, 9232978617785735780n, 13999801545444333449n, 11541223272232169725n, 17499751931805416812n, 14426529090290212157n, 8039631859474607303n, 18033161362862765196n, 14661225842770647033n, 11270725851789228247n, 18386638188586430203n, 14088407314736535309n, 18371611717305649850n, 17610509143420669137n, 9129456591349898601n, 11006568214637918210n, 17235125415662156385n, 13758210268297397763n, 12320534732722919674n, 17197762835371747204n, 10788982397476261688n, 10748601772107342002n, 15966486035277439363n, 13435752215134177503n, 10734735507242023396n, 16794690268917721879n, 8806733365625141341n, 10496681418073576174n, 12421737381156795194n, 13120851772591970218n, 6303799689591218185n, 16401064715739962772n, 17103121648843798539n, 10250665447337476733n, 1466078993672598279n, 12813331809171845916n, 6444284760518135752n, 16016664761464807395n, 8055355950647669691n, 10010415475915504622n, 2728754459941099604n, 12513019344894380777n, 12634315111781150314n, 15641274181117975972n, 1957835834444274180n, 9775796363198734982n, 10447019433382447170n, 12219745453998418728n, 3835402254873283155n, 15274681817498023410n, 4794252818591603944n, 9546676135936264631n, 7608094030047140369n, 11933345169920330789n, 4898431519131537557n, 14916681462400413486n, 10734725417341809851n, 9322925914000258429n, 2097517367411243253n, 11653657392500323036n, 7233582727691441970n, 14567071740625403795n, 9041978409614302462n, 18208839675781754744n, 6690786993590490174n, 11380524797363596715n, 4181741870994056359n, 14225655996704495894n, 615491320315182544n, 17782069995880619867n, 9992736187248753989n, 11113793747425387417n, 3939617107816777291n, 13892242184281734271n, 9536207403198359517n, 17365302730352167839n, 7308573235570561493n, 10853314206470104899n, 11485387299872682789n, 13566642758087631124n, 9745048106413465582n, 16958303447609538905n, 12181310133016831978n, 10598939654755961816n, 695789805494438130n, 13248674568444952270n, 869737256868047663n, 16560843210556190337n, 10310543607939835386n, 10350527006597618960n, 17973304801030866876n, 12938158758247023701n, 4019886927579031980n, 16172698447808779626n, 9636544677901177879n, 10107936529880487266n, 10634526442115624078n, 12634920662350609083n, 4069786015789754290n, 15793650827938261354n, 475546501309804958n, 9871031767461413346n, 4908902581746016003n, 12338789709326766682n, 15359500264037295811n, 15423487136658458353n, 9976003293191843956n, 9639679460411536470n, 17764217104313372233n, 12049599325514420588n, 12981899343536939483n, 15061999156893025735n, 16227374179421174354n, 9413749473058141084n, 17059637889779315827n, 11767186841322676356n, 2877803288514593168n, 14708983551653345445n, 3597254110643241460n, 18386229439566681806n, 9108253656731439729n, 11491393399729176129n, 1080972517029761926n, 14364241749661470161n, 5962901664714590312n, 17955302187076837701n, 12065313099320625794n, 11222063866923023563n, 9846663696289085073n, 14027579833653779454n, 7696643601933968437n, 17534474792067224318n, 397432465562684739n, 10959046745042015198n, 14083453346258841674n, 13698808431302518998n, 8380944645968776284n, 17123510539128148748n, 1252808770606194547n, 10702194086955092967n, 10006377518483647400n, 13377742608693866209n, 7896285879677171346n, 16722178260867332761n, 14482043368023852087n, 10451361413042082976n, 2133748077373825698n, 13064201766302603720n, 2667185096717282123n, 16330252207878254650n, 3333981370896602653n, 10206407629923909156n, 6695424375237764562n, 12758009537404886445n, 8369280469047205703n, 15947511921756108056n, 15073286604736395033n, 9967194951097567535n, 9420804127960246895n, 12458993688871959419n, 7164319141522920715n, 15573742111089949274n, 4343712908476262990n, 9733588819431218296n, 7326506586225052273n, 12166986024289022870n, 9158133232781315341n, 15208732530361278588n, 2224294504121868368n, 9505457831475799117n, 10613556101930943538n, 11881822289344748896n, 17878631145841067327n, 14852277861680936121n, 3901544858591782542n, 9282673663550585075n, 13967680582688333849n, 11603342079438231344n, 12847914709933029407n, 14504177599297789180n, 16059893387416286759n, 18130221999122236476n, 1628122660560806833n, 11331388749451397797n, 10240948699705280078n, 14164235936814247246n, 17412871893058988002n, 17705294921017809058n, 12542717829468959195n, 11065809325636130661n, 12450884661845487401n, 13832261657045163327n, 1728547772024695539n, 17290327071306454158n, 15995742770313033136n, 10806454419566533849n, 5385653213018257806n, 13508068024458167311n, 11343752534700210161n, 16885085030572709139n, 9568004649947874797n, 10553178144107943212n, 3674159897003727796n, 13191472680134929015n, 4592699871254659745n, 16489340850168661269n, 1129188820640936778n, 10305838031355413293n, 3011586022114279438n, 12882297539194266616n, 8376168546070237202n, 16102871923992833270n, 10470210682587796502n, 10064294952495520794n, 1932195658189984910n, 12580368690619400992n, 11638616609592256945n, 15725460863274251240n, 14548270761990321182n, 9828413039546407025n, 9092669226243950738n, 12285516299433008781n, 15977522551232326327n, 15356895374291260977n, 6136845133758244197n, 9598059608932038110n, 15364743254667372383n, 11997574511165047638n, 9982557031479439671n, 14996968138956309548n, 3254824252494523781n, 9373105086847693467n, 11257637194663853171n, 11716381358559616834n, 9460360474902428559n, 14645476698199521043n, 2602078556773259891n, 18306845872749401303n, 17087656251248738576n, 11441778670468375814n, 17597314184671543466n, 14302223338085469768n, 12773270693984653525n, 17877779172606837210n, 15966588367480816906n, 11173611982879273256n, 14590803748102898470n, 13967014978599091570n, 18238504685128623088n, 17458768723248864463n, 13574758819556003052n, 10911730452030540289n, 15401753289863583763n, 13639663065038175362n, 5417133557047315992n, 17049578831297719202n, 15994788983163920798n, 10655986769561074501n, 14608429132904838403n, 13319983461951343127n, 4425478360848884291n, 16649979327439178909n, 920161932633717460n, 10406237079649486818n, 2880944217109767365n, 13007796349561858522n, 12824552308241985014n, 16259745436952323153n, 6807318348447705459n, 10162340898095201970n, 15783789013848285672n, 12702926122619002463n, 10506364230455581282n, 15878657653273753079n, 8521269269642088699n, 9924161033296095674n, 12243322321167387293n, 12405201291620119593n, 6080780864604458308n, 15506501614525149491n, 12212662099182960789n, 9691563509078218432n, 5327070802775656541n, 12114454386347773040n, 6658838503469570676n, 15143067982934716300n, 8323548129336963345n, 9464417489334197687n, 14425589617690377899n, 11830521861667747109n, 13420301003685584469n, 14788152327084683887n, 2940318199324816875n, 9242595204427927429n, 8755227902219092403n, 11553244005534909286n, 15555720896201253407n, 14441555006918636608n, 10221279083396790951n, 18051943758648295760n, 12776598854245988689n, 11282464849155184850n, 7985374283903742931n, 14103081061443981063n, 758345818024902856n, 17628851326804976328n, 14782990327813292282n, 11018032079253110205n, 9239368954883307676n, 13772540099066387756n, 16160897212031522499n, 17215675123832984696n, 1754377441329851508n, 10759796952395615435n, 1096485900831157192n, 13449746190494519293n, 15205665431321110202n, 16812182738118149117n, 5172023733869224041n, 10507614211323843198n, 5538357842881958977n, 13134517764154803997n, 16146319340457224530n, 16418147205193504997n, 6347841120289366950n, 10261342003245940623n, 6273243709394548296n, 12826677504057425779n, 3229868618315797466n, 16033346880071782223n, 17872393828176910545n, 10020841800044863889n, 18087775170251650946n, 12526052250056079862n, 8774660907532399971n, 15657565312570099828n, 1744954097560724156n, 9785978320356312392n, 10313968347830228405n, 12232472900445390490n, 12892460434787785506n, 15290591125556738113n, 6892203506629956075n, 9556619453472961320n, 15836842237712192307n, 11945774316841201651n, 1349308723430688768n, 14932217896051502063n, 15521693959570524672n, 9332636185032188789n, 16618587752372659776n, 11665795231290235987n, 6938176635183661008n, 14582244039112794984n, 4061034775552188356n, 18227805048890993730n, 5076293469440235445n, 11392378155556871081n, 7784369436827535057n, 14240472694446088851n, 14342147814461806725n, 17800590868057611064n, 13315998749649870503n, 11125369292536006915n, 8322499218531169064n, 13906711615670008644n, 5791438004736573426n, 17383389519587510805n, 7239297505920716783n, 10864618449742194253n, 6830403950414141941n, 13580773062177742816n, 13149690956445065330n, 16975966327722178520n, 16437113695556331663n, 10609978954826361575n, 10273196059722707289n, 13262473693532951969n, 8229809056225996208n, 16578092116916189961n, 14898947338709883164n, 10361307573072618726n, 2394313059052595121n, 12951634466340773407n, 12216263360670519709n, 16189543082925966759n, 10658643182410761733n, 10118464426828729224n, 13579181016647807939n, 12648080533535911530n, 16973976270809759924n, 15810100666919889413n, 11994098301657424097n, 9881312916824930883n, 9802154447749584012n, 12351641146031163604n, 7641007041259592112n, 15439551432538954505n, 9551258801574490140n, 9649719645336846565n, 17498751797052526097n, 12062149556671058207n, 8038381691033493909n, 15077686945838822759n, 5436291095364479483n];
const _M0FPC28internal7strconv12double__info = new _M0TPC28internal7strconv9FloatInfo(52, 11, -1023);
const _M0FPC28internal7strconv25min__exponent__fast__path = 18446744073709551594n;
const _M0FPC28internal7strconv25max__exponent__fast__path = 22n;
const _M0FPC28internal7strconv36max__exponent__disguised__fast__path = 37n;
const _M0FPC28internal7strconv25max__mantissa__fast__path = 9007199254740992n;
const _M0FPC28internal7strconv6powtab = [1, 3, 6, 9, 13, 16, 19, 23, 26, 29, 33, 36, 39, 43, 46, 49, 53, 56, 59];
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2066 = { _0: 0, _1: "" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2067 = { _0: 1, _1: "5" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2068 = { _0: 1, _1: "25" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2069 = { _0: 1, _1: "125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2070 = { _0: 2, _1: "625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2071 = { _0: 2, _1: "3125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2072 = { _0: 2, _1: "15625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2073 = { _0: 3, _1: "78125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2074 = { _0: 3, _1: "390625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2075 = { _0: 3, _1: "1953125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2076 = { _0: 4, _1: "9765625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2077 = { _0: 4, _1: "48828125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2078 = { _0: 4, _1: "244140625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2079 = { _0: 4, _1: "1220703125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2080 = { _0: 5, _1: "6103515625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2081 = { _0: 5, _1: "30517578125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2082 = { _0: 5, _1: "152587890625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2083 = { _0: 6, _1: "762939453125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2084 = { _0: 6, _1: "3814697265625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2085 = { _0: 6, _1: "19073486328125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2086 = { _0: 7, _1: "95367431640625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2087 = { _0: 7, _1: "476837158203125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2088 = { _0: 7, _1: "2384185791015625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2089 = { _0: 7, _1: "11920928955078125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2090 = { _0: 8, _1: "59604644775390625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2091 = { _0: 8, _1: "298023223876953125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2092 = { _0: 8, _1: "1490116119384765625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2093 = { _0: 9, _1: "7450580596923828125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2094 = { _0: 9, _1: "37252902984619140625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2095 = { _0: 9, _1: "186264514923095703125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2096 = { _0: 10, _1: "931322574615478515625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2097 = { _0: 10, _1: "4656612873077392578125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2098 = { _0: 10, _1: "23283064365386962890625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2099 = { _0: 10, _1: "116415321826934814453125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2100 = { _0: 11, _1: "582076609134674072265625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2101 = { _0: 11, _1: "2910383045673370361328125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2102 = { _0: 11, _1: "14551915228366851806640625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2103 = { _0: 12, _1: "72759576141834259033203125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2104 = { _0: 12, _1: "363797880709171295166015625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2105 = { _0: 12, _1: "1818989403545856475830078125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2106 = { _0: 13, _1: "9094947017729282379150390625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2107 = { _0: 13, _1: "45474735088646411895751953125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2108 = { _0: 13, _1: "227373675443232059478759765625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2109 = { _0: 13, _1: "1136868377216160297393798828125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2110 = { _0: 14, _1: "5684341886080801486968994140625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2111 = { _0: 14, _1: "28421709430404007434844970703125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2112 = { _0: 14, _1: "142108547152020037174224853515625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2113 = { _0: 15, _1: "710542735760100185871124267578125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2114 = { _0: 15, _1: "3552713678800500929355621337890625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2115 = { _0: 15, _1: "17763568394002504646778106689453125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2116 = { _0: 16, _1: "88817841970012523233890533447265625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2117 = { _0: 16, _1: "444089209850062616169452667236328125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2118 = { _0: 16, _1: "2220446049250313080847263336181640625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2119 = { _0: 16, _1: "11102230246251565404236316680908203125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2120 = { _0: 17, _1: "55511151231257827021181583404541015625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2121 = { _0: 17, _1: "277555756156289135105907917022705078125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2122 = { _0: 17, _1: "1387778780781445675529539585113525390625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2123 = { _0: 18, _1: "6938893903907228377647697925567626953125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2124 = { _0: 18, _1: "34694469519536141888238489627838134765625" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2125 = { _0: 18, _1: "173472347597680709441192448139190673828125" };
const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2126 = { _0: 19, _1: "867361737988403547205962240695953369140625" };
const _M0FPC28internal7strconv19left__shift__cheats = [_M0FPC28internal7strconv19left__shift__cheatsN5tupleS2066, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2067, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2068, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2069, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2070, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2071, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2072, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2073, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2074, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2075, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2076, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2077, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2078, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2079, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2080, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2081, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2082, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2083, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2084, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2085, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2086, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2087, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2088, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2089, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2090, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2091, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2092, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2093, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2094, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2095, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2096, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2097, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2098, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2099, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2100, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2101, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2102, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2103, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2104, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2105, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2106, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2107, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2108, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2109, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2110, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2111, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2112, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2113, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2114, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2115, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2116, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2117, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2118, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2119, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2120, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2121, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2122, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2123, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2124, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2125, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS2126];
const _M0FPC28internal7strconv10int__pow10 = [1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n, 10000000n, 100000000n, 1000000000n, 10000000000n, 100000000000n, 1000000000000n, 10000000000000n, 100000000000000n, 1000000000000000n];
const _M0FPC28internal7strconv5table = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1e+12, 1e+13, 1e+14, 1e+15, 1e+16, 1e+17, 1e+18, 1e+19, 1e+20, 1e+21, 1e+22, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const _M0FPC28internal7strconv12checked__mulN6constrS2263 = 0n;
const _M0FPC14json17int__pow10__table = [1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n, 10000000n, 100000000n, 1000000000n, 10000000000n, 100000000000n, 1000000000000n, 10000000000000n, 100000000000000n, 1000000000000000n];
const _M0FPC14json12pow10__table = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1e+12, 1e+13, 1e+14, 1e+15, 1e+16, 1e+17, 1e+18, 1e+19, 1e+20, 1e+21, 1e+22, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const _M0FPC14json12checked__mulN6constrS2530 = 0n;
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3891 = { _0: "--threshold", _1: "threshold", _2: 0, _3: 64, _4: 6 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3892 = { _0: "--max-images", _1: "maxImages", _2: 1, _3: 10000, _4: 1000 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3893 = { _0: "--max-decode-pixels", _1: "maxDecodePixels", _2: 1, _3: 100000000, _4: 64000000 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3894 = { _0: "--max-pixels", _1: "maxPixels", _2: 1, _3: 4194304, _4: 4194304 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3895 = { _0: "--max-total-pixels", _1: "maxTotalPixels", _2: 1, _3: 1000000000, _4: 100000000 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3896 = { _0: "--max-file-bytes", _1: "maxFileBytes", _2: 1, _3: 1073741824, _4: 33554432 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3897 = { _0: "--max-comparisons", _1: "maxComparisons", _2: 0, _3: 10000000, _4: 1000000 };
const _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3898 = { _0: "--max-pairs", _1: "maxPairs", _2: 0, _3: 100000, _4: 10000 };
const _M0FPB4seed = _M0FPB12random__seed();
const _M0FPC28internal7strconv17parse__scientificN8exp__numS2164 = 0n;
const _M0FPC28internal7strconv17check__underscoreN25_2atransition__table__222S2267 = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 0, 1, 2, 5];
const _M0FPC28internal7strconv15parse__inf__nanN25_2atransition__table__304S2243 = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 3, 4, 14, 14, 14, 14, 14, 14, 14, 7, 14, 14, 14, 14, 5, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 6, 14, 14, 14, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 8, 14, 14, 14, 14, 14, 1, 14, 14, 9, 14, 14, 14, 14, 14, 14, 14, 14, 10, 14, 14, 14, 14, 14, 14, 11, 14, 14, 14, 14, 14, 14, 14, 14, 14, 12, 14, 14, 14, 14, 14, 14, 14, 14, 13, 14, 1, 14, 14, 14, 14, 14, 14, 14];
const _M0MPC16string10StringView4findN6constrS401 = 0;
const _M0FP36cjyhjy10visionleak4core15workflow__splitN7_2abindS3183 = "/";
const _M0FP36cjyhjy10visionleak4core18workflow__coverageN7_2abindS3192 = "_BUDGET";
const _M0MPC16string6String4trimN7_2abindS560 = "\t\n\r ";
const _M0FP36cjyhjy10visionleak4core23validate__report__valueN7_2abindS3323 = "/";
const _M0FP36cjyhjy10visionleak4core12score__valueN7_2abindS3565 = "challenge-";
const _M0FP36cjyhjy10visionleak4core13crop__windowsN5tupleS3647 = { _0: 0, _1: 0 };
const _M0FP36cjyhjy10visionleak4core27cli__parse__report__commandN7_2abindS3941 = "--";
const _M0FP36cjyhjy10visionleak4core10cli__parseN7_2abindS3955 = "--";
const _M0FP36cjyhjy10visionleak4core16mirror__distanceN5tupleS4083 = { _0: -1, _1: "" };
const _M0FP36cjyhjy10visionleak4core21orientation__distanceN5tupleS4102 = { _0: -1, _1: "" };
const _M0FP36cjyhjy10visionleak4core10run__auditN7_2abindS4115 = "";
function _M0FPB13consume4__acc(acc, input) {
  const _p = (acc >>> 0) + ((Math.imul(input, -1028477379) | 0) >>> 0) | 0;
  const _p$2 = 17;
  return Math.imul(_p << _p$2 | (_p >>> (32 - _p$2 | 0) | 0), 668265263) | 0;
}
function _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGyEE(dst, dst_offset, src, src_offset, len) {
  if (dst === src && dst_offset < src_offset) {
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < len) {
        const _tmp$2 = dst_offset + i | 0;
        const _tmp$3 = src_offset + i | 0;
        if (_tmp$2 >>> 0 < dst.length) {
          dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
        } else {
          $oob();
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  } else {
    let _tmp = len - 1 | 0;
    while (true) {
      const i = _tmp;
      if (i >= 0) {
        const _tmp$2 = dst_offset + i | 0;
        const _tmp$3 = src_offset + i | 0;
        if (_tmp$2 >>> 0 < dst.length) {
          dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
        } else {
          $oob();
        }
        _tmp = i - 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
}
function _M0MPB18UninitializedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, len) {
  _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGyEE(dst, dst_offset, src, src_offset, len);
}
function _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(src, allocate_len, src_offset, dst_offset, blit_len) {
  const dst = new Uint8Array(allocate_len);
  _M0MPB18UninitializedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, blit_len);
  return dst;
}
function _M0MPB13StringBuilder13write__objectGdE(self, obj) {
  _M0IP016_24default__implPB4Show6outputGdE(obj, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0MPB13StringBuilder21StringBuilder_2einner(size_hint) {
  return new _M0TPB13StringBuilder("");
}
function _M0IPB13StringBuilderPB6Logger11write__char(self, ch) {
  self.val = `${self.val}${String.fromCodePoint(ch)}`;
}
function _M0IPB13StringBuilderPB6Logger13write__string(self, str) {
  self.val = `${self.val}${str}`;
}
function _M0FPB32code__point__of__surrogate__pair(leading, trailing) {
  return (((Math.imul(leading - 55296 | 0, 1024) | 0) + trailing | 0) - 56320 | 0) + 65536 | 0;
}
function _M0MPC16string6String16unsafe__char__at(self, index) {
  const c1 = self.charCodeAt(index);
  if (c1 >= 55296 && c1 <= 56319) {
    const c2 = self.charCodeAt(index + 1 | 0);
    return _M0FPB32code__point__of__surrogate__pair(c1, c2);
  } else {
    return c1;
  }
}
function _M0MPC14byte4Byte7to__hexN14to__hex__digitS62(i) {
  if (i < 10) {
    const _p = 48;
    const _p$2 = (i + _p | 0) & 255;
    return _p$2;
  } else {
    const _p = 97;
    const _p$2 = (i + _p | 0) & 255;
    const _p$3 = 10;
    const _p$4 = (_p$2 - _p$3 | 0) & 255;
    return _p$4;
  }
}
function _M0MPC14byte4Byte7to__hex(b) {
  const _self = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  const _p = 16;
  _M0IPB13StringBuilderPB6Logger11write__char(_self, _M0MPC14byte4Byte7to__hexN14to__hex__digitS62((b / _p | 0) & 255));
  const _p$2 = 16;
  _M0IPB13StringBuilderPB6Logger11write__char(_self, _M0MPC14byte4Byte7to__hexN14to__hex__digitS62((b % _p$2 | 0) & 255));
  const _p$3 = _self;
  return _p$3.val;
}
function _M0MPC16string10StringView21clamped__view_2einner(self, start, end) {
  const len = self.end - self.start | 0;
  let lo = start < 0 ? 0 : start > len ? len : start;
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _e = _Some;
    hi = _e < 0 ? 0 : _e > len ? len : _e;
  }
  const str = self.str;
  const base = self.start;
  let _tmp;
  if (lo > 0) {
    let _tmp$2;
    if (lo < len) {
      let _tmp$3;
      const _p = str.charCodeAt(base + lo | 0);
      if (_p >= 56320 && _p <= 57343) {
        const _p$2 = str.charCodeAt((base + lo | 0) - 1 | 0);
        _tmp$3 = _p$2 >= 55296 && _p$2 <= 56319;
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    } else {
      _tmp$2 = false;
    }
    _tmp = _tmp$2;
  } else {
    _tmp = false;
  }
  if (_tmp) {
    lo = lo + 1 | 0;
  }
  let _tmp$2;
  if (hi > 0) {
    let _tmp$3;
    if (hi < len) {
      let _tmp$4;
      const _p = str.charCodeAt(base + hi | 0);
      if (_p >= 56320 && _p <= 57343) {
        const _p$2 = str.charCodeAt((base + hi | 0) - 1 | 0);
        _tmp$4 = _p$2 >= 55296 && _p$2 <= 56319;
      } else {
        _tmp$4 = false;
      }
      _tmp$3 = _tmp$4;
    } else {
      _tmp$3 = false;
    }
    _tmp$2 = _tmp$3;
  } else {
    _tmp$2 = false;
  }
  if (_tmp$2) {
    hi = hi - 1 | 0;
  }
  return lo >= hi ? new _M0TPC16string10StringView(str, base + lo | 0, base + lo | 0) : new _M0TPC16string10StringView(str, base + lo | 0, base + hi | 0);
}
function _M0MPC16string10StringView12view_2einner(self, start_offset, end_offset) {
  let end_offset$2;
  if (end_offset === undefined) {
    end_offset$2 = self.end - self.start | 0;
  } else {
    const _Some = end_offset;
    end_offset$2 = _Some;
  }
  if (start_offset >= 0 && (start_offset <= end_offset$2 && end_offset$2 <= (self.end - self.start | 0))) {
    return new _M0TPC16string10StringView(self.str, self.start + start_offset | 0, self.start + end_offset$2 | 0);
  } else {
    return $panic();
  }
}
function _M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(x, y) {
  return !_M0IPC14json4JsonPB2Eq5equal(x, y);
}
function _M0FPB14avalanche__acc(acc) {
  let acc$2 = acc;
  acc$2 = acc$2 ^ (acc$2 >>> 15 | 0);
  acc$2 = Math.imul(acc$2, -2048144777) | 0;
  acc$2 = acc$2 ^ (acc$2 >>> 13 | 0);
  acc$2 = Math.imul(acc$2, -1028477379) | 0;
  acc$2 = acc$2 ^ (acc$2 >>> 16 | 0);
  return acc$2;
}
function _M0FPB13finalize__acc(acc) {
  return _M0FPB14avalanche__acc(acc);
}
function _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE(self, show) {
  show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE(self, show) {
  show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0MPC16string6String21clamped__view_2einner(self, start, end) {
  const len = self.length;
  let lo = start < 0 ? 0 : start > len ? len : start;
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _e = _Some;
    hi = _e < 0 ? 0 : _e > len ? len : _e;
  }
  let _tmp;
  if (lo > 0) {
    let _tmp$2;
    if (lo < len) {
      let _tmp$3;
      const _p = self.charCodeAt(lo);
      if (_p >= 56320 && _p <= 57343) {
        const _p$2 = self.charCodeAt(lo - 1 | 0);
        _tmp$3 = _p$2 >= 55296 && _p$2 <= 56319;
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    } else {
      _tmp$2 = false;
    }
    _tmp = _tmp$2;
  } else {
    _tmp = false;
  }
  if (_tmp) {
    lo = lo + 1 | 0;
  }
  let _tmp$2;
  if (hi > 0) {
    let _tmp$3;
    if (hi < len) {
      let _tmp$4;
      const _p = self.charCodeAt(hi);
      if (_p >= 56320 && _p <= 57343) {
        const _p$2 = self.charCodeAt(hi - 1 | 0);
        _tmp$4 = _p$2 >= 55296 && _p$2 <= 56319;
      } else {
        _tmp$4 = false;
      }
      _tmp$3 = _tmp$4;
    } else {
      _tmp$3 = false;
    }
    _tmp$2 = _tmp$3;
  } else {
    _tmp$2 = false;
  }
  if (_tmp$2) {
    hi = hi - 1 | 0;
  }
  return lo >= hi ? new _M0TPC16string10StringView(self, lo, lo) : new _M0TPC16string10StringView(self, lo, hi);
}
function _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(self, value, start, len) {
  _M0IPB13StringBuilderPB6Logger11write__view(self, _M0MPC16string6String21clamped__view_2einner(value, start, start + len | 0));
}
function _M0IP016_24default__implPB4Show6outputGdE(self, logger) {
  logger.method_table.method_0(logger.self, _M0IPC16double6DoublePB4Show10to__string(self));
}
function _M0MPB4Iter4nextGcE(self) {
  const _func = self.f;
  const result = _func();
  const _bind = self.size_hint;
  if (result === -1) {
    self.size_hint = _M0MPB4Iter4nextN6constrS121GcE;
  } else {
    if (_bind === undefined) {
    } else {
      const _Some = _bind;
      const _n = _Some;
      self.size_hint = _n > 0 ? _n - 1 | 0 : _M0MPB4Iter4nextN6constrS120GcE;
    }
  }
  return result;
}
function _M0MPB4Iter4nextGUsRPB4JsonEE(self) {
  const _func = self.f;
  const result = _func();
  const _bind = self.size_hint;
  if (result === undefined) {
    self.size_hint = _M0MPB4Iter4nextN6constrS129GUsRPB4JsonEE;
  } else {
    if (_bind === undefined) {
    } else {
      const _Some = _bind;
      const _n = _Some;
      self.size_hint = _n > 0 ? _n - 1 | 0 : _M0MPB4Iter4nextN6constrS128GUsRPB4JsonEE;
    }
  }
  return result;
}
function _M0MPC13int3Int18to__string_2einner(self, radix) {
  return _M0FPB19int__to__string__js(self, radix);
}
function _M0MPC14uint4UInt18to__string_2einner(self, radix) {
  return _M0FPB20uint__to__string__js(self, radix);
}
function _M0MPB4Iter3newGcE(f, size_hint) {
  let size_hint$2;
  if (size_hint === undefined) {
    size_hint$2 = undefined;
  } else {
    const _Some = size_hint;
    const _n = _Some;
    size_hint$2 = _n > 0 ? _n : _M0MPB4Iter3newN6constrS172GcE;
  }
  return new _M0TPB4IterGcE(f, size_hint$2);
}
function _M0MPB4Iter3newGUsRPB4JsonEE(f, size_hint) {
  let size_hint$2;
  if (size_hint === undefined) {
    size_hint$2 = undefined;
  } else {
    const _Some = size_hint;
    const _n = _Some;
    size_hint$2 = _n > 0 ? _n : _M0MPB4Iter3newN6constrS178GUsRPB4JsonEE;
  }
  return new _M0TPB4IterGUsRPB4JsonEE(f, size_hint$2);
}
function _M0MPC15array10FixedArray21clamped__view_2einnerGyE(self, start, end) {
  const len = self.length;
  const lo = start < 0 ? 0 : start > len ? len : start;
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _end = _Some;
    hi = _end < 0 ? 0 : _end > len ? len : _end;
  }
  const count = hi > lo ? hi - lo | 0 : 0;
  const _bind = self;
  return new _M0TPB9ArrayViewGyE(_bind, lo, lo + count | 0);
}
function _M0MPC15array10FixedArray21clamped__view_2einnerGkE(self, start, end) {
  const len = self.length;
  const lo = start < 0 ? 0 : start > len ? len : start;
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _end = _Some;
    hi = _end < 0 ? 0 : _end > len ? len : _end;
  }
  const count = hi > lo ? hi - lo | 0 : 0;
  const _bind = self;
  return new _M0TPB9ArrayViewGkE(_bind, lo, lo + count | 0);
}
function _M0MPC16string10StringView11code__units(self) {
  const _p = self.str.length;
  let _tmp;
  if (_p <= 0) {
    _tmp = [];
  } else {
    const _p$2 = 0;
    const _p$3 = $make_array_len_and_init(_p, self.str.charCodeAt(_p$2));
    let _tmp$2 = 1;
    while (true) {
      const _p$4 = _tmp$2;
      if (_p$4 < _p) {
        if (_p$4 >>> 0 < _p$3.length) {
          _p$3[_p$4] = self.str.charCodeAt(_p$4);
        } else {
          $oob();
        }
        _tmp$2 = _p$4 + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _tmp = _p$3;
  }
  return _M0MPC15array10FixedArray21clamped__view_2einnerGkE(_tmp, self.start, self.end);
}
function _M0MPC16string10StringView9to__owned(self) {
  return self.str.substring(self.start, self.end);
}
function _M0MPC16string10StringView4iter(self) {
  const start = self.start;
  const end = self.end;
  const index = new _M0TPB8MutLocalGiE(start);
  return _M0MPB4Iter3newGcE(() => {
    if (index.val < end) {
      const c1 = self.str.charCodeAt(index.val);
      if (c1 >= 55296 && c1 <= 56319 && (index.val + 1 | 0) < self.end) {
        const c2 = self.str.charCodeAt(index.val + 1 | 0);
        if (c2 >= 56320 && c2 <= 57343) {
          index.val = index.val + 2 | 0;
          return _M0FPB32code__point__of__surrogate__pair(c1, c2);
        }
      }
      index.val = index.val + 1 | 0;
      return c1;
    } else {
      return -1;
    }
  }, undefined);
}
function _M0MPC16string6String20unsafe__range__equal(self, self_off, other, other_off, len) {
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < len) {
      const _p = self.charCodeAt(self_off + i | 0);
      const _p$2 = other.charCodeAt(other_off + i | 0);
      if (_p === _p$2) {
      } else {
        return false;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return true;
}
function _M0MPC16string10StringView16lexical__compare(self, other) {
  const self_len = self.end - self.start | 0;
  const other_len = other.end - other.start | 0;
  const min_len = self_len < other_len ? self_len : other_len;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < min_len) {
      const x = self.str.charCodeAt(self.start + i | 0);
      const y = other.str.charCodeAt(other.start + i | 0);
      if (x !== y) {
        return x < y ? -1 : 1;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return $compare_int(self_len, other_len);
}
function _M0MPC16string6String19exact__view_2einner(self, start, end) {
  const len = self.length;
  let end$2;
  if (end === undefined) {
    end$2 = len;
  } else {
    const _Some = end;
    const _end = _Some;
    end$2 = _end;
  }
  if (start >= 0 && (start <= end$2 && end$2 <= len)) {
    if (start < len) {
      const _p = self.charCodeAt(start);
      if (!(_p >= 56320 && _p <= 57343)) {
      } else {
        $panic();
      }
    }
    if (end$2 < len) {
      const _p = self.charCodeAt(end$2);
      if (!(_p >= 56320 && _p <= 57343)) {
      } else {
        $panic();
      }
    }
    return new _M0TPC16string10StringView(self, start, end$2);
  } else {
    return $panic();
  }
}
function _M0MPC16string6String24char__length__ge_2einner(self, len, start_offset, end_offset) {
  let end_offset$2;
  if (end_offset === undefined) {
    end_offset$2 = self.length;
  } else {
    const _Some = end_offset;
    end_offset$2 = _Some;
  }
  let _tmp = start_offset;
  let _tmp$2 = 0;
  while (true) {
    const index = _tmp;
    const count = _tmp$2;
    if (index < end_offset$2 && count < len) {
      const c1 = self.charCodeAt(index);
      if (c1 >= 55296 && c1 <= 56319 && (index + 1 | 0) < end_offset$2) {
        const c2 = self.charCodeAt(index + 1 | 0);
        if (c2 >= 56320 && c2 <= 57343) {
          _tmp = index + 2 | 0;
          _tmp$2 = count + 1 | 0;
          continue;
        } else {
          $panic();
        }
      }
      _tmp = index + 1 | 0;
      _tmp$2 = count + 1 | 0;
      continue;
    } else {
      return count >= len;
    }
  }
}
function _M0MPC16string6String31offset__of__nth__char__backward(self, n, start_offset, end_offset) {
  let _tmp = end_offset;
  let _tmp$2 = 0;
  while (true) {
    const utf16_offset = _tmp;
    const char_count = _tmp$2;
    if ((utf16_offset - 1 | 0) >= start_offset && char_count < n) {
      const c = self.charCodeAt(utf16_offset - 1 | 0);
      if (c >= 56320 && c <= 57343) {
        _tmp = utf16_offset - 2 | 0;
        _tmp$2 = char_count + 1 | 0;
        continue;
      } else {
        _tmp = utf16_offset - 1 | 0;
        _tmp$2 = char_count + 1 | 0;
        continue;
      }
    } else {
      return char_count < n || utf16_offset < start_offset ? undefined : utf16_offset;
    }
  }
}
function _M0MPC16string6String30offset__of__nth__char__forward(self, n, start_offset, end_offset) {
  if (start_offset >= 0 && start_offset <= end_offset) {
    let _tmp = start_offset;
    let _tmp$2 = 0;
    while (true) {
      const utf16_offset = _tmp;
      const char_count = _tmp$2;
      if (utf16_offset < end_offset && char_count < n) {
        const c = self.charCodeAt(utf16_offset);
        if (c >= 55296 && c <= 56319) {
          _tmp = utf16_offset + 2 | 0;
          _tmp$2 = char_count + 1 | 0;
          continue;
        } else {
          _tmp = utf16_offset + 1 | 0;
          _tmp$2 = char_count + 1 | 0;
          continue;
        }
      } else {
        return char_count < n || utf16_offset >= end_offset ? undefined : utf16_offset;
      }
    }
  } else {
    return $panic();
  }
}
function _M0MPC16string6String29offset__of__nth__char_2einner(self, i, start_offset, end_offset) {
  let end_offset$2;
  if (end_offset === undefined) {
    end_offset$2 = self.length;
  } else {
    const _Some = end_offset;
    end_offset$2 = _Some;
  }
  return i >= 0 ? _M0MPC16string6String30offset__of__nth__char__forward(self, i, start_offset, end_offset$2) : _M0MPC16string6String31offset__of__nth__char__backward(self, -i | 0, start_offset, end_offset$2);
}
function _M0MPC16string6String12view_2einner(self, start_offset, end_offset) {
  let end_offset$2;
  if (end_offset === undefined) {
    end_offset$2 = self.length;
  } else {
    const _Some = end_offset;
    end_offset$2 = _Some;
  }
  if (start_offset >= 0 && (start_offset <= end_offset$2 && end_offset$2 <= self.length)) {
    return new _M0TPC16string10StringView(self, start_offset, end_offset$2);
  } else {
    return $panic();
  }
}
function _M0IPB13StringBuilderPB6Logger11write__view(self, str) {
  self.val = `${self.val}${_M0MPC16string10StringView9to__owned(str)}`;
}
function _M0FPB19kmp__failure__table(pattern) {
  const m = pattern.end - pattern.start | 0;
  const table = $make_array_len_and_init(m, 0);
  let k = 0;
  let _tmp = 1;
  while (true) {
    const i = _tmp;
    if (i < m) {
      const c = pattern.str.charCodeAt(pattern.start + i | 0);
      while (true) {
        let _tmp$2;
        if (k > 0) {
          const _p = pattern.str.charCodeAt(pattern.start + k | 0);
          _tmp$2 = c !== _p;
        } else {
          _tmp$2 = false;
        }
        if (_tmp$2) {
          const _tmp$3 = k - 1 | 0;
          k = _tmp$3 >>> 0 < table.length ? table[_tmp$3] : $oob();
          continue;
        } else {
          break;
        }
      }
      const _p = pattern.str.charCodeAt(pattern.start + k | 0);
      if (c === _p) {
        k = k + 1 | 0;
      }
      if (i >>> 0 < table.length) {
        table[i] = k;
      } else {
        $oob();
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return table;
}
function _M0FPB24find__pattern__kmp__from(target, pattern, start) {
  const n = target.end - target.start | 0;
  const m = pattern.end - pattern.start | 0;
  const table = _M0FPB19kmp__failure__table(pattern);
  let k = 0;
  let _tmp = start;
  while (true) {
    const i = _tmp;
    if (i < n) {
      const c = target.str.charCodeAt(target.start + i | 0);
      while (true) {
        let _tmp$2;
        if (k > 0) {
          const _p = pattern.str.charCodeAt(pattern.start + k | 0);
          _tmp$2 = c !== _p;
        } else {
          _tmp$2 = false;
        }
        if (_tmp$2) {
          const _tmp$3 = k - 1 | 0;
          k = _tmp$3 >>> 0 < table.length ? table[_tmp$3] : $oob();
          continue;
        } else {
          break;
        }
      }
      const _p = pattern.str.charCodeAt(pattern.start + k | 0);
      if (c === _p) {
        k = k + 1 | 0;
      }
      if (k === m) {
        return (i - m | 0) + 1 | 0;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return undefined;
}
function _M0FPB36find__two__anchor__candidate__scalar(data, start, candidate_end, first, last_offset, last) {
  let _tmp = start;
  while (true) {
    const pos = _tmp;
    if (pos < candidate_end) {
      let _tmp$2;
      const _p = data.charCodeAt(pos);
      if (_p === first) {
        const _p$2 = data.charCodeAt(pos + last_offset | 0);
        _tmp$2 = _p$2 === last;
      } else {
        _tmp$2 = false;
      }
      if (_tmp$2) {
        return pos;
      }
      _tmp = pos + 1 | 0;
      continue;
    } else {
      return -1;
    }
  }
}
function _M0FPB42find__two__anchor__candidate__from__string(data, start, candidate_end, first, last_offset, last) {
  return _M0FPB36find__two__anchor__candidate__scalar(data, start, candidate_end, first, last_offset, last);
}
function _M0FPB21string__ranges__equal(left, left_start, right, right_start, length) {
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < length) {
      const _p = left.charCodeAt(left_start + i | 0);
      const _p$2 = right.charCodeAt(right_start + i | 0);
      if (_p !== _p$2) {
        return false;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return true;
}
function _M0FPB22find__by__two__anchors(target, pattern) {
  const target_len = target.end - target.start | 0;
  const pattern_len = pattern.end - pattern.start | 0;
  const target_start = target.start;
  const pattern_start = pattern.start;
  const last_offset = pattern_len - 1 | 0;
  const candidate_end = ((target_start + target_len | 0) - pattern_len | 0) + 1 | 0;
  const first = pattern.str.charCodeAt(pattern.start);
  const last = pattern.str.charCodeAt(pattern.start + last_offset | 0);
  const middle_len = last_offset - 1 | 0;
  let _tmp = target_start;
  let _tmp$2 = 0;
  while (true) {
    const pos = _tmp;
    const failures = _tmp$2;
    if (pos < candidate_end) {
      const found = _M0FPB42find__two__anchor__candidate__from__string(target.str, pos, candidate_end, first, last_offset, last);
      if (found < 0) {
        return undefined;
      }
      if (_M0FPB21string__ranges__equal(target.str, found + 1 | 0, pattern.str, pattern_start + 1 | 0, middle_len)) {
        return found - target_start | 0;
      }
      const failures$2 = failures + 1 | 0;
      const scanned = found - target_start | 0;
      if (failures$2 > 64 || failures$2 > (4 + (scanned / 8 | 0) | 0)) {
        return _M0FPB24find__pattern__kmp__from(target, pattern, scanned + 1 | 0);
      }
      _tmp = found + 1 | 0;
      _tmp$2 = failures$2;
      continue;
    } else {
      return undefined;
    }
  }
}
function _M0FPB24find__code__unit__scalar(data, start, end, code) {
  let _tmp = start;
  while (true) {
    const pos = _tmp;
    if (pos < end) {
      const _p = data.charCodeAt(pos);
      if (_p === code) {
        return pos;
      }
      _tmp = pos + 1 | 0;
      continue;
    } else {
      return -1;
    }
  }
}
function _M0FPB30find__code__unit__from__string(data, start, end, code) {
  return _M0FPB24find__code__unit__scalar(data, start, end, code);
}
function _M0FPB28find__code__unit__from__view(target, start, end, code) {
  const target_start = target.start;
  const found = _M0FPB30find__code__unit__from__string(target.str, target_start + start | 0, target_start + end | 0, code);
  return found < 0 ? -1 : found - target_start | 0;
}
function _M0MPC16string10StringView4find(self, str) {
  const pattern_len = str.end - str.start | 0;
  switch (pattern_len) {
    case 0: {
      return _M0MPC16string10StringView4findN6constrS401;
    }
    case 1: {
      const found = _M0FPB28find__code__unit__from__view(self, 0, self.end - self.start | 0, str.str.charCodeAt(str.start));
      return found < 0 ? undefined : found;
    }
    default: {
      return pattern_len > (self.end - self.start | 0) ? undefined : _M0FPB22find__by__two__anchors(self, str);
    }
  }
}
function _M0MPC16string6String6repeat(self, n) {
  if (n < 0) {
    return $panic();
  } else {
    if (n === 0) {
      return "";
    } else {
      if (n === 1) {
        return self;
      } else {
        const len = self.length;
        const total = Math.imul(len, n) | 0;
        if (len === 0 || (total / n | 0) === len) {
          const buf = _M0MPB13StringBuilder21StringBuilder_2einner(total);
          const str = self;
          let _tmp = 0;
          while (true) {
            const _ = _tmp;
            if (_ < n) {
              _M0IPB13StringBuilderPB6Logger13write__string(buf, str);
              _tmp = _ + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          return buf.val;
        } else {
          return $panic();
        }
      }
    }
  }
}
function _M0MPC16string10StringView11has__suffix(self, str) {
  const self_len = self.end - self.start | 0;
  const str_len = str.end - str.start | 0;
  if (str_len <= self_len) {
    const start = self_len - str_len | 0;
    let _tmp;
    if (str_len === 0) {
      _tmp = true;
    } else {
      const _p = self.str.charCodeAt(self.start + start | 0);
      const _p$2 = str.str.charCodeAt(str.start);
      _tmp = _p === _p$2;
    }
    if (_tmp) {
      return _M0MPC16string6String20unsafe__range__equal(self.str, self.start + start | 0, str.str, str.start, str_len);
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function _M0MPC16string6String11has__suffix(self, str) {
  return _M0MPC16string10StringView11has__suffix(new _M0TPC16string10StringView(self, 0, self.length), str);
}
function _M0MPC16string10StringView11has__prefix(self, str) {
  const str_len = str.end - str.start | 0;
  if (str_len <= (self.end - self.start | 0)) {
    let _tmp;
    if (str_len === 0) {
      _tmp = true;
    } else {
      const _p = self.str.charCodeAt(self.start);
      const _p$2 = str.str.charCodeAt(str.start);
      _tmp = _p === _p$2;
    }
    if (_tmp) {
      return _M0MPC16string6String20unsafe__range__equal(self.str, self.start, str.str, str.start, str_len);
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function _M0MPC16string6String11has__prefix(self, str) {
  return _M0MPC16string10StringView11has__prefix(new _M0TPC16string10StringView(self, 0, self.length), str);
}
function _M0MPC15array5Array4pushGsE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0MPC15array5Array4pushGiE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0MPC15array5Array4pushGRPB5ArrayGiEE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0FPB36string__contains__code__unit__scalar(str, start, end, code) {
  let _tmp = start;
  while (true) {
    const i = _tmp;
    if (i < end) {
      const _p = str.charCodeAt(i);
      if (_p === code) {
        return true;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return false;
}
function _M0FPB28string__contains__code__unit(str, start, end, code) {
  return _M0FPB36string__contains__code__unit__scalar(str, start, end, code);
}
function _M0MPC16string10StringView20contains__code__unit(self, code) {
  return _M0FPB28string__contains__code__unit(self.str, self.start, self.end, code);
}
function _M0FPB23build__ascii__char__set(chars) {
  let bits0 = 0;
  let bits1 = 0;
  let bits2 = 0;
  let bits3 = 0;
  const _bind = chars.str;
  const _bind$2 = chars.start;
  const _bind$3 = chars.end;
  let _tmp = _bind$2;
  while (true) {
    const _string_index = _tmp;
    if (_string_index < _bind$3) {
      let _decoded_next_string_index;
      let _decoded_char;
      _L: {
        const _bind$4 = _bind.charCodeAt(_string_index);
        if (_bind$4 >= 55296 && _bind$4 <= 56319 && (_string_index + 1 | 0) < _bind$3) {
          const _bind$5 = _bind.charCodeAt(_string_index + 1 | 0);
          if (_bind$5 >= 56320 && _bind$5 <= 57343) {
            const _tmp$2 = _string_index + 2 | 0;
            const _p = (((Math.imul(_bind$4 - 55296 | 0, 1024) | 0) + _bind$5 | 0) - 56320 | 0) + 65536 | 0;
            _decoded_next_string_index = _tmp$2;
            _decoded_char = _p;
            break _L;
          } else {
            const _tmp$2 = _string_index + 1 | 0;
            const _p = _bind$4;
            _decoded_next_string_index = _tmp$2;
            _decoded_char = _p;
            break _L;
          }
        } else {
          const _tmp$2 = _string_index + 1 | 0;
          const _p = _bind$4;
          _decoded_next_string_index = _tmp$2;
          _decoded_char = _p;
          break _L;
        }
      }
      const code = _decoded_char;
      if (code >>> 0 < 128 >>> 0) {
        const bit = 1 << (code & 31);
        const _bind$4 = code >>> 5 | 0;
        switch (_bind$4) {
          case 0: {
            bits0 = bits0 | bit;
            break;
          }
          case 1: {
            bits1 = bits1 | bit;
            break;
          }
          case 2: {
            bits2 = bits2 | bit;
            break;
          }
          default: {
            bits3 = bits3 | bit;
          }
        }
      } else {
        return undefined;
      }
      _tmp = _decoded_next_string_index;
      continue;
    } else {
      break;
    }
  }
  return { _0: bits0, _1: bits1, _2: bits2, _3: bits3 };
}
function _M0FPB26ascii__char__set__contains(bits0, bits1, bits2, bits3, code) {
  if (code >>> 0 < 128 >>> 0) {
    const bit = 1 << (code & 31);
    const _bind = code >>> 5 | 0;
    switch (_bind) {
      case 0: {
        return (bits0 & bit) !== 0;
      }
      case 1: {
        return (bits1 & bit) !== 0;
      }
      case 2: {
        return (bits2 & bit) !== 0;
      }
      default: {
        return (bits3 & bit) !== 0;
      }
    }
  } else {
    return false;
  }
}
function _M0FPB34string__trim__start__ascii__scalar(str, start, end, bits0, bits1, bits2, bits3) {
  let _tmp = start;
  while (true) {
    const pos = _tmp;
    let _tmp$2;
    if (pos < end) {
      const _p = str.charCodeAt(pos);
      _tmp$2 = _M0FPB26ascii__char__set__contains(bits0, bits1, bits2, bits3, _p);
    } else {
      _tmp$2 = false;
    }
    if (_tmp$2) {
      _tmp = pos + 1 | 0;
      continue;
    } else {
      return pos;
    }
  }
}
function _M0FPB32string__trim__end__ascii__scalar(str, start, end, bits0, bits1, bits2, bits3) {
  let _tmp = end;
  while (true) {
    const pos = _tmp;
    let _tmp$2;
    if (pos > start) {
      const _p = str.charCodeAt(pos - 1 | 0);
      _tmp$2 = _M0FPB26ascii__char__set__contains(bits0, bits1, bits2, bits3, _p);
    } else {
      _tmp$2 = false;
    }
    if (_tmp$2) {
      _tmp = pos - 1 | 0;
      continue;
    } else {
      return pos;
    }
  }
}
function _M0FPB26string__trim__start__ascii(str, start, end, _chars, bits0, bits1, bits2, bits3) {
  return _M0FPB34string__trim__start__ascii__scalar(str, start, end, bits0, bits1, bits2, bits3);
}
function _M0FPB24string__trim__end__ascii(str, start, end, _chars, bits0, bits1, bits2, bits3) {
  return _M0FPB32string__trim__end__ascii__scalar(str, start, end, bits0, bits1, bits2, bits3);
}
function _M0MPC16string10StringView14contains__char(self, c) {
  const len = self.end - self.start | 0;
  if (len > 0) {
    const c$2 = c;
    if (c$2 >= 0 && c$2 <= 65535) {
      return _M0MPC16string10StringView20contains__code__unit(self, c$2 & 65535);
    } else {
      if (c$2 < 0) {
        return false;
      } else {
        if (len >= 2) {
          const adj = c$2 - 65536 | 0;
          const high = 55296 + (adj >> 10) | 0;
          if (high <= 65535) {
            const high$2 = high & 65535;
            const low = (56320 + (adj & 1023) | 0) & 65535;
            let _tmp = 0;
            while (true) {
              const i = _tmp;
              if (i < (len - 1 | 0)) {
                const _p = self.str.charCodeAt(self.start + i | 0);
                if (_p === high$2) {
                  const _p$2 = self.str.charCodeAt(self.start + (i + 1 | 0) | 0);
                  if (_p$2 === low) {
                    return true;
                  }
                  _tmp = i + 2 | 0;
                  continue;
                }
                _tmp = i + 1 | 0;
                continue;
              } else {
                break;
              }
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return false;
  } else {
    return false;
  }
}
function _M0MPC16string10StringView24trim__start__with__chars(self, chars) {
  let _tmp = self;
  while (true) {
    const x = _tmp;
    if ((x.end - x.start | 0) === 0) {
      return x;
    } else {
      const _c = _M0MPC16string6String16unsafe__char__at(x.str, _M0MPC16string6String29offset__of__nth__char_2einner(x.str, 0, x.start, x.end));
      const _tmp$2 = x.str;
      const _bind = _M0MPC16string6String29offset__of__nth__char_2einner(x.str, 1, x.start, x.end);
      let _tmp$3;
      if (_bind === undefined) {
        _tmp$3 = x.end;
      } else {
        const _Some = _bind;
        _tmp$3 = _Some;
      }
      const _x = new _M0TPC16string10StringView(_tmp$2, _tmp$3, x.end);
      if (_M0MPC16string10StringView14contains__char(chars, _c)) {
        _tmp = _x;
        continue;
      } else {
        return x;
      }
    }
  }
}
function _M0MPC16string10StringView22trim__end__with__chars(self, chars) {
  let _tmp = self;
  while (true) {
    const x = _tmp;
    if ((x.end - x.start | 0) === 0) {
      return x;
    } else {
      const _c = _M0MPC16string6String16unsafe__char__at(x.str, _M0MPC16string6String29offset__of__nth__char_2einner(x.str, -1, x.start, x.end));
      const _x = new _M0TPC16string10StringView(x.str, x.start, _M0MPC16string6String29offset__of__nth__char_2einner(x.str, -1, x.start, x.end));
      if (_M0MPC16string10StringView14contains__char(chars, _c)) {
        _tmp = _x;
        continue;
      } else {
        return x;
      }
    }
  }
}
function _M0MPC16string10StringView12trim_2einner(self, chars) {
  const _bind = _M0FPB23build__ascii__char__set(chars);
  if (_bind === undefined) {
    return _M0MPC16string10StringView22trim__end__with__chars(_M0MPC16string10StringView24trim__start__with__chars(self, chars), chars);
  } else {
    const _Some = _bind;
    const _x = _Some;
    const _bits0 = _x._0;
    const _bits1 = _x._1;
    const _bits2 = _x._2;
    const _bits3 = _x._3;
    const start = _M0FPB26string__trim__start__ascii(self.str, self.start, self.end, chars, _bits0, _bits1, _bits2, _bits3);
    const end = _M0FPB24string__trim__end__ascii(self.str, start, self.end, chars, _bits0, _bits1, _bits2, _bits3);
    return new _M0TPC16string10StringView(self.str, start, end);
  }
}
function _M0MPC16string6String12trim_2einner(self, chars) {
  return _M0MPC16string10StringView12trim_2einner(new _M0TPC16string10StringView(self, 0, self.length), chars);
}
function _M0MPC16string6String4trim(self, chars$46$opt) {
  let chars;
  if (chars$46$opt === undefined) {
    chars = new _M0TPC16string10StringView(_M0MPC16string6String4trimN7_2abindS560, 0, _M0MPC16string6String4trimN7_2abindS560.length);
  } else {
    const _Some = chars$46$opt;
    chars = _Some;
  }
  return _M0MPC16string6String12trim_2einner(self, chars);
}
function _M0MPC16string6String4iter(self) {
  const len = self.length;
  const index = new _M0TPB8MutLocalGiE(0);
  return _M0MPB4Iter3newGcE(() => {
    if (index.val < len) {
      const c1 = self.charCodeAt(index.val);
      if (c1 >= 55296 && c1 <= 56319 && (index.val + 1 | 0) < len) {
        const c2 = self.charCodeAt(index.val + 1 | 0);
        if (c2 >= 56320 && c2 <= 57343) {
          const c = _M0FPB32code__point__of__surrogate__pair(c1, c2);
          index.val = index.val + 2 | 0;
          return c;
        }
      }
      index.val = index.val + 1 | 0;
      return c1;
    } else {
      return -1;
    }
  }, undefined);
}
function _M0MPB4Iter3mapGRPC16string10StringViewsE(self, f) {
  return new _M0TPB4IterGsE(() => {
    const _bind = _M0MPB4Iter4nextGUsRPB4JsonEE(self);
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _x = _Some;
      return f(_x);
    }
  }, self.size_hint);
}
function _M0MPB4Iter3mapGcRPC16string10StringViewE(self, f) {
  return new _M0TPB4IterGRPC16string10StringViewE(() => {
    const _bind = _M0MPB4Iter4nextGcE(self);
    if (_bind === -1) {
      return undefined;
    } else {
      const _Some = _bind;
      const _x = _Some;
      return f(_x);
    }
  }, self.size_hint);
}
function _M0IPC14char4CharPB4Show10to__string(self) {
  return String.fromCodePoint(self);
}
function _M0MPC16string10StringView5split(self, sep) {
  const sep_len = sep.end - sep.start | 0;
  if (sep_len === 0) {
    return _M0MPB4Iter3mapGcRPC16string10StringViewE(_M0MPC16string10StringView4iter(self), (c) => _M0MPC16string6String12view_2einner(_M0IPC14char4CharPB4Show10to__string(c), 0, undefined));
  }
  const remaining = new _M0TPB8MutLocalGORPC16string10StringViewE(self);
  return _M0MPB4Iter3newGUsRPB4JsonEE(() => {
    const _bind = remaining.val;
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _view = _Some;
      const _bind$2 = _M0MPC16string10StringView4find(_view, sep);
      if (_bind$2 === undefined) {
        remaining.val = undefined;
        return _view;
      } else {
        const _Some$2 = _bind$2;
        const _end = _Some$2;
        remaining.val = _M0MPC16string10StringView12view_2einner(_view, _end + sep_len | 0, undefined);
        return _M0MPC16string10StringView12view_2einner(_view, 0, _end);
      }
    }
  }, undefined);
}
function _M0MPC16string6String5split(self, sep) {
  return _M0MPC16string10StringView5split(new _M0TPC16string10StringView(self, 0, self.length), sep);
}
function _M0MPB4Iter9to__arrayGsE(self) {
  const _bind = self.size_hint;
  let result;
  if (_bind === undefined) {
    result = [];
  } else {
    result = [];
  }
  while (true) {
    const _bind$2 = _M0MPB4Iter4nextGUsRPB4JsonEE(self);
    if (_bind$2 === undefined) {
      break;
    } else {
      const _Some = _bind$2;
      const _x = _Some;
      _M0MPC15array5Array4pushGsE(result, _x);
      continue;
    }
  }
  return result;
}
function _M0MPC16string10StringView9get__char(self, idx) {
  if (idx >= 0 && idx < (self.end - self.start | 0)) {
    const c = self.str.charCodeAt(self.start + idx | 0);
    if (c >= 55296 && c <= 56319) {
      if ((idx + 1 | 0) < (self.end - self.start | 0)) {
        const next = self.str.charCodeAt(self.start + (idx + 1 | 0) | 0);
        return next >= 56320 && next <= 57343 ? _M0FPB32code__point__of__surrogate__pair(c, next) : -1;
      } else {
        return -1;
      }
    } else {
      return c >= 56320 && c <= 57343 ? -1 : c;
    }
  } else {
    return -1;
  }
}
function _M0MPC16string6String16lexical__compare(self, other) {
  return _M0MPC16string10StringView16lexical__compare(new _M0TPC16string10StringView(self, 0, self.length), new _M0TPC16string10StringView(other, 0, other.length));
}
function _M0MPC15array9ArrayView21clamped__view_2einnerGkE(self, start, end) {
  const len = self.end - self.start | 0;
  const lo = start < 0 ? 0 : start > len ? len : start;
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _end = _Some;
    hi = _end < 0 ? 0 : _end > len ? len : _end;
  }
  const count = hi > lo ? hi - lo | 0 : 0;
  const _bind = self.buf;
  const _bind$2 = self.start + lo | 0;
  return new _M0TPB9ArrayViewGkE(_bind, _bind$2, _bind$2 + count | 0);
}
function _M0MPC16option6Option10unwrap__orGRPB4JsonE(self, default_) {
  if (self === undefined) {
    return default_;
  } else {
    const _Some = self;
    const _t = _Some;
    return _t;
  }
}
function _M0MPC16option6Option10unwrap__orGRPB5ArrayGiEE(self, default_) {
  if (self.$tag === 1) {
    const _Some = self;
    const _t = _Some._0;
    return _t;
  } else {
    return default_;
  }
}
function _M0MPC16option6Option10unwrap__orGcE(self, default_) {
  if (self === -1) {
    return default_;
  } else {
    const _Some = self;
    const _t = _Some;
    return _t;
  }
}
function _M0MPC16option6Option3mapGRPC16string10StringViewsE(self, f) {
  if (self === undefined) {
    return undefined;
  } else {
    const _Some = self;
    const _t = _Some;
    return f(_t);
  }
}
function _M0MPC13int3Int20next__power__of__two(self) {
  if (self >= 0) {
    if (self <= 1) {
      return 1;
    }
    if (self > 1073741824) {
      return 1073741824;
    }
    return (2147483647 >> (Math.clz32(self - 1 | 0) - 1 | 0)) + 1 | 0;
  } else {
    return $panic();
  }
}
function _M0FPB8new__mapGsRPB4JsonE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGsRPB4JsonE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGsbE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGsbE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGsiE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGsiE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGibE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGibE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGiRPB5ArrayGsEE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGiRPB5ArrayGsEE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGsRPB5ArrayGiEE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGsRPB5ArrayGiEE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGiiE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGiiE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB8new__mapGiRPB5ArrayGiEE(capacity) {
  const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
  const _bind = capacity$2 - 1 | 0;
  const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
  const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
  const _bind$4 = undefined;
  return new _M0TPB3MapGiRPB5ArrayGiEE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
}
function _M0FPB21capacity__for__length(length) {
  let capacity = _M0MPC13int3Int20next__power__of__two(length);
  const _p = capacity;
  if (length > ((Math.imul(_p, 13) | 0) / 16 | 0)) {
    capacity = Math.imul(capacity, 2) | 0;
  }
  return capacity;
}
function _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGsbE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGsiE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGibE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGsEE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGiiE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGiEE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGiEE(self, idx, entry) {
  const _bind = self.tail;
  if (_bind === -1) {
    self.head = entry;
  } else {
    const _tmp = self.entries;
    const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    _tmp$2.next = entry;
  }
  self.tail = idx;
  self.entries[idx] = entry;
  self.size = self.size + 1 | 0;
}
function _M0MPB3Map10set__entryGsRPB4JsonE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGsbE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGsiE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGibE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGiRPB5ArrayGsEE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGiiE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGsRPB5ArrayGiEE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10set__entryGiRPB5ArrayGiEE(self, entry, new_idx) {
  const _bind = entry.next;
  if (_bind === undefined) {
    self.tail = new_idx;
  } else {
    const _Some = _bind;
    const _next = _Some;
    _next.prev = new_idx;
  }
  self.entries[new_idx] = entry;
}
function _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGsRPB4JsonE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsRPB4JsonE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGsbE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGsbE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsbE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGsiE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGsiE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsiE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGibE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGibE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGibE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGiRPB5ArrayGsEE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGiRPB5ArrayGsEE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGiRPB5ArrayGsEE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGiiE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGiiE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGiiE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGsRPB5ArrayGiEE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGsRPB5ArrayGiEE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsRPB5ArrayGiEE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map10push__awayGiRPB5ArrayGiEE(self, idx, entry) {
  let _tmp = entry.psl + 1 | 0;
  let _tmp$2 = idx + 1 & self.capacity_mask;
  let _tmp$3 = entry;
  while (true) {
    const psl = _tmp;
    const idx$2 = _tmp$2;
    const entry$2 = _tmp$3;
    const _bind = self.entries[idx$2];
    if (_bind === undefined) {
      entry$2.psl = psl;
      _M0MPB3Map10set__entryGiRPB5ArrayGiEE(self, entry$2, idx$2);
      return;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (psl > _curr_entry.psl) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGiRPB5ArrayGiEE(self, entry$2, idx$2);
        _tmp = _curr_entry.psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        _tmp$3 = _curr_entry;
        continue;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx$2 + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGsRPB4JsonE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGsbE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGsbE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGsbE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsbE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGsiE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGsiE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGsiE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsiE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGibE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGibE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGibE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGibE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGiRPB5ArrayGsEE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGsEE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGiRPB5ArrayGsEE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGsEE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGiiE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGiiE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGiiE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGiiE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGsRPB5ArrayGiEE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGiEE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGsRPB5ArrayGiEE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGiEE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map20rehash__place__entryGiRPB5ArrayGiEE(self, outer) {
  const hash = outer.hash;
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      outer.psl = psl;
      outer.prev = self.tail;
      _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGiEE(self, idx, outer);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr = _Some;
      if (psl > _curr.psl) {
        _M0MPB3Map10push__awayGiRPB5ArrayGiEE(self, idx, _curr);
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGiEE(self, idx, outer);
        return undefined;
      } else {
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
}
function _M0MPB3Map4growGsRPB4JsonE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGsRPB4JsonE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGsbE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGsbE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGsiE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGsiE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGibE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGibE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGiRPB5ArrayGsEE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGiRPB5ArrayGsEE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGiiE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGiiE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGsRPB5ArrayGiEE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGsRPB5ArrayGiEE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map4growGiRPB5ArrayGiEE(self) {
  const old_head = self.head;
  const new_capacity = self.capacity << 1;
  self.entries = $make_array_len_and_init(new_capacity, undefined);
  self.capacity = new_capacity;
  self.capacity_mask = new_capacity - 1 | 0;
  const _p = self.capacity;
  self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
  self.size = 0;
  self.head = undefined;
  self.tail = -1;
  let _tmp = old_head;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      return;
    } else {
      const _Some = x;
      const _e = _Some;
      const next_in_chain = _e.next;
      _e.next = undefined;
      _M0MPB3Map20rehash__place__entryGiRPB5ArrayGiEE(self, _e);
      _tmp = next_in_chain;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGsRPB4JsonE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGsRPB4JsonE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGsRPB4JsonE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB4JsonE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsRPB4JsonE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGsbE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGsbE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGsbE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGsbE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsbE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGsbE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsbE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsbE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGsiE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGsiE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGsiE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGsiE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsiE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGsiE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsiE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsiE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGibE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGibE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGibE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGibE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGibE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGibE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGibE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGibE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGiRPB5ArrayGsEE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGiRPB5ArrayGsEE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGiRPB5ArrayGsEE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGsEE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGiRPB5ArrayGsEE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGiRPB5ArrayGsEE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGiRPB5ArrayGsEE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGsEE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGssE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGsRPB4JsonE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGssE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB4JsonE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGssE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGiiE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGiiE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGiiE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGiiE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGiiE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGiiE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGiiE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGiiE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGsRPB5ArrayGiEE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGsRPB5ArrayGiEE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGsRPB5ArrayGiEE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGiEE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB5ArrayGiEE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGsRPB5ArrayGiEE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsRPB5ArrayGiEE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGiEE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map15set__with__hashGiRPB5ArrayGiEE(self, key, value, hash) {
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const psl = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      if (self.size >= self.grow_at) {
        _M0MPB3Map4growGiRPB5ArrayGiEE(self);
        _tmp = 0;
        _tmp$2 = hash & self.capacity_mask;
        continue;
      }
      const _bind$2 = self.tail;
      const _bind$3 = undefined;
      const entry = new _M0TPB5EntryGiRPB5ArrayGiEE(_bind$2, _bind$3, psl, hash, key, value);
      _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGiEE(self, idx, entry);
      return undefined;
    } else {
      const _Some = _bind;
      const _curr_entry = _Some;
      if (_curr_entry.hash === hash && _curr_entry.key === key) {
        _curr_entry.value = value;
        return undefined;
      }
      if (psl > _curr_entry.psl) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGiRPB5ArrayGiEE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        _M0MPB3Map10push__awayGiRPB5ArrayGiEE(self, idx, _curr_entry);
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGiRPB5ArrayGiEE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGiEE(self, idx, entry);
        return undefined;
      }
      _tmp = psl + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3setGsRPB4JsonE(self, key, value) {
  _M0MPB3Map15set__with__hashGsRPB4JsonE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
}
function _M0MPB3Map3setGsbE(self, key, value) {
  _M0MPB3Map15set__with__hashGsbE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
}
function _M0MPB3Map3setGsiE(self, key, value) {
  _M0MPB3Map15set__with__hashGsiE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
}
function _M0MPB3Map3setGibE(self, key, value) {
  _M0MPB3Map15set__with__hashGibE(self, key, value, _M0IPC13int3IntPB4Hash4hash(key));
}
function _M0MPB3Map3setGiRPB5ArrayGsEE(self, key, value) {
  _M0MPB3Map15set__with__hashGiRPB5ArrayGsEE(self, key, value, _M0IPC13int3IntPB4Hash4hash(key));
}
function _M0MPB3Map3setGssE(self, key, value) {
  _M0MPB3Map15set__with__hashGssE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
}
function _M0MPB3Map3setGiiE(self, key, value) {
  _M0MPB3Map15set__with__hashGiiE(self, key, value, _M0IPC13int3IntPB4Hash4hash(key));
}
function _M0MPB3Map3setGsRPB5ArrayGiEE(self, key, value) {
  _M0MPB3Map15set__with__hashGsRPB5ArrayGiEE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
}
function _M0MPB3Map3setGiRPB5ArrayGiEE(self, key, value) {
  _M0MPB3Map15set__with__hashGiRPB5ArrayGiEE(self, key, value, _M0IPC13int3IntPB4Hash4hash(key));
}
function _M0MPB3Map3MapGsRPB4JsonE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGsRPB4JsonE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGsRPB4JsonE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGsbE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGsbE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGsbE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGsiE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGsiE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGsiE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGibE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGibE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGibE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGiRPB5ArrayGsEE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGiRPB5ArrayGsEE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGiRPB5ArrayGsEE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGssE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGsRPB4JsonE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGssE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGsRPB5ArrayGiEE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGsRPB5ArrayGiEE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGsRPB5ArrayGiEE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGiiE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGiiE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGiiE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3MapGiRPB5ArrayGiEE(arr, capacity) {
  const length = arr.end - arr.start | 0;
  let capacity$2;
  if (capacity === undefined) {
    capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
  } else {
    const _Some = capacity;
    const _capacity = _Some;
    const _p = _M0FPB21capacity__for__length(length);
    capacity$2 = _capacity > _p ? _capacity : _p;
  }
  const m = _M0FPB8new__mapGiRPB5ArrayGiEE(capacity$2);
  const _bind = arr.end - arr.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = arr.buf[arr.start + _ | 0];
      _M0MPB3Map3setGiRPB5ArrayGiEE(m, e._0, e._1);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return m;
}
function _M0MPB3Map3getGsRPB4JsonE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return _entry.value;
      }
      if (i > _entry.psl) {
        return undefined;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3getGsiE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return _entry.value;
      }
      if (i > _entry.psl) {
        return undefined;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3getGiRPB5ArrayGsEE(self, key) {
  const hash = _M0IPC13int3IntPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return _M0DTPC16option6OptionGRPB5ArrayGsEE4None__;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return new _M0DTPC16option6OptionGRPB5ArrayGsEE4Some(_entry.value);
      }
      if (i > _entry.psl) {
        return _M0DTPC16option6OptionGRPB5ArrayGsEE4None__;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3getGssE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return _entry.value;
      }
      if (i > _entry.psl) {
        return undefined;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3getGsRPB5ArrayGiEE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return _M0DTPC16option6OptionGRPB5ArrayGiEE4None__;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return new _M0DTPC16option6OptionGRPB5ArrayGiEE4Some(_entry.value);
      }
      if (i > _entry.psl) {
        return _M0DTPC16option6OptionGRPB5ArrayGiEE4None__;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3getGiiE(self, key) {
  const hash = _M0IPC13int3IntPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return _entry.value;
      }
      if (i > _entry.psl) {
        return undefined;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map3getGiRPB5ArrayGiEE(self, key) {
  const hash = _M0IPC13int3IntPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return _M0DTPC16option6OptionGRPB5ArrayGiEE4None__;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return new _M0DTPC16option6OptionGRPB5ArrayGiEE4Some(_entry.value);
      }
      if (i > _entry.psl) {
        return _M0DTPC16option6OptionGRPB5ArrayGiEE4None__;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map2atGssE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      $panic();
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return _entry.value;
      }
      if (i <= _entry.psl) {
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      } else {
        $panic();
      }
    }
    continue;
  }
}
function _M0MPB3Map2atGsRPB4JsonE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      $panic();
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return _entry.value;
      }
      if (i <= _entry.psl) {
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      } else {
        $panic();
      }
    }
    continue;
  }
}
function _M0MPB3Map8containsGsbE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return false;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return true;
      }
      if (i > _entry.psl) {
        return false;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map8containsGibE(self, key) {
  const hash = _M0IPC13int3IntPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return false;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return true;
      }
      if (i > _entry.psl) {
        return false;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map8containsGssE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return false;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return true;
      }
      if (i > _entry.psl) {
        return false;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map8containsGsRPB4JsonE(self, key) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return false;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && _entry.key === key) {
        return true;
      }
      if (i > _entry.psl) {
        return false;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map12contains__kvGsRPB4JsonE(self, key, value) {
  const hash = _M0IPC16string6StringPB4Hash4hash(key);
  let _tmp = 0;
  let _tmp$2 = hash & self.capacity_mask;
  while (true) {
    const i = _tmp;
    const idx = _tmp$2;
    const _bind = self.entries[idx];
    if (_bind === undefined) {
      return false;
    } else {
      const _Some = _bind;
      const _entry = _Some;
      if (_entry.hash === hash && (_entry.key === key && _M0IPC14json4JsonPB2Eq5equal(_entry.value, value))) {
        return true;
      }
      if (i > _entry.psl) {
        return false;
      }
      _tmp = i + 1 | 0;
      _tmp$2 = idx + 1 & self.capacity_mask;
      continue;
    }
  }
}
function _M0MPB3Map4iterGsRPB4JsonE(self) {
  const curr_entry = new _M0TPB8MutLocalGORPB5EntryGsRPB4JsonEE(self.head);
  const len = self.size;
  const remaining = new _M0TPB8MutLocalGiE(len);
  return _M0MPB4Iter3newGUsRPB4JsonEE(() => {
    _L: {
      if (remaining.val > 0) {
        const _bind = curr_entry.val;
        if (_bind === undefined) {
          break _L;
        } else {
          const _Some = _bind;
          const _x = _Some;
          const _key = _x.key;
          const _value = _x.value;
          const _next = _x.next;
          curr_entry.val = _next;
          remaining.val = remaining.val - 1 | 0;
          return { _0: _key, _1: _value };
        }
      } else {
        break _L;
      }
    }
    return undefined;
  }, len);
}
function _M0MPB3Map4iterGiRPB5ArrayGsEE(self) {
  const curr_entry = new _M0TPB8MutLocalGORPB5EntryGiRPB5ArrayGsEEE(self.head);
  const len = self.size;
  const remaining = new _M0TPB8MutLocalGiE(len);
  return _M0MPB4Iter3newGUsRPB4JsonEE(() => {
    _L: {
      if (remaining.val > 0) {
        const _bind = curr_entry.val;
        if (_bind === undefined) {
          break _L;
        } else {
          const _Some = _bind;
          const _x = _Some;
          const _key = _x.key;
          const _value = _x.value;
          const _next = _x.next;
          curr_entry.val = _next;
          remaining.val = remaining.val - 1 | 0;
          return { _0: _key, _1: _value };
        }
      } else {
        break _L;
      }
    }
    return undefined;
  }, len);
}
function _M0MPB3Map5iter2GiRPB5ArrayGsEE(self) {
  return _M0MPB3Map4iterGiRPB5ArrayGsEE(self);
}
function _M0MPB3Map5iter2GsRPB4JsonE(self) {
  return _M0MPB3Map4iterGsRPB4JsonE(self);
}
function _M0IPB3MapPB2Eq5equalGsRPB4JsonE(self, that) {
  if (self.size === that.size) {
    const _it = _M0MPB3Map5iter2GsRPB4JsonE(self);
    while (true) {
      const _bind = _M0MPB5Iter24nextGsRPB4JsonE(_it);
      if (_bind === undefined) {
        return true;
      } else {
        const _Some = _bind;
        const _x = _Some;
        const _k = _x._0;
        const _v = _x._1;
        if (_M0MPB3Map12contains__kvGsRPB4JsonE(that, _k, _v)) {
        } else {
          return false;
        }
        continue;
      }
    }
  } else {
    return false;
  }
}
function _M0IPC14json4JsonPB2Eq5equal(a, b) {
  switch (a.$tag) {
    case 0: {
      if (b.$tag === 0) {
        return true;
      } else {
        return false;
      }
    }
    case 1: {
      if (b.$tag === 1) {
        return true;
      } else {
        return false;
      }
    }
    case 2: {
      if (b.$tag === 2) {
        return true;
      } else {
        return false;
      }
    }
    case 3: {
      const _Number = a;
      const _a_num = _Number._0;
      if (b.$tag === 3) {
        const _Number$2 = b;
        const _b_num = _Number$2._0;
        return _a_num === _b_num;
      } else {
        return false;
      }
    }
    case 4: {
      const _String = a;
      const _a_str = _String._0;
      if (b.$tag === 4) {
        const _String$2 = b;
        const _b_str = _String$2._0;
        return _a_str === _b_str;
      } else {
        return false;
      }
    }
    case 5: {
      const _Array = a;
      const _a_arr = _Array._0;
      if (b.$tag === 5) {
        const _Array$2 = b;
        const _b_arr = _Array$2._0;
        return _M0IPC15array5ArrayPB2Eq5equalGRPB4JsonE(_a_arr, _b_arr);
      } else {
        return false;
      }
    }
    default: {
      const _Object = a;
      const _a_obj = _Object._0;
      if (b.$tag === 6) {
        const _Object$2 = b;
        const _b_obj = _Object$2._0;
        return _M0IPB3MapPB2Eq5equalGsRPB4JsonE(_a_obj, _b_obj);
      } else {
        return false;
      }
    }
  }
}
function _M0MPC14json4Json4JsonGbE(value) {
  return _M0IPC14bool4BoolPB6ToJson8to__json(value);
}
function _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(value) {
  return _M0IPC15array5ArrayPB6ToJson8to__jsonGRPB4JsonE(value);
}
function _M0MPC14json4Json4JsonGsE(value) {
  return new _M0DTPB4Json6String(value);
}
function _M0MPC14json4Json4JsonGiE(value) {
  return _M0IPC13int3IntPB6ToJson8to__json(value);
}
function _M0MPC14json4Json4JsonGRPB5ArrayGsEE(value) {
  return _M0IPC15array5ArrayPB6ToJson8to__jsonGsE(value);
}
function _M0MPC14json4Json4JsonGRPB5ArrayGiEE(value) {
  return _M0IPC15array5ArrayPB6ToJson8to__jsonGiE(value);
}
function _M0MPC14json4Json4JsonGRPB5ArrayGRPB5ArrayGiEEE(value) {
  return _M0IPC15array5ArrayPB6ToJson8to__jsonGRPB5ArrayGiEE(value);
}
function _M0MPC14json4Json4JsonGdE(value) {
  return _M0IPC16double6DoublePB6ToJson8to__json(value);
}
function _M0IPC14bool4BoolPB6ToJson8to__json(self) {
  if (self) {
    const _p = true;
    return _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__;
  } else {
    const _p = false;
    return _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__;
  }
}
function _M0IPC13int3IntPB6ToJson8to__json(self) {
  const _p = self + 0;
  const _p$2 = undefined;
  return new _M0DTPB4Json6Number(_p, _p$2);
}
function _M0IPC16double6DoublePB6ToJson8to__json(self) {
  if (self !== self) {
    const _p = "NaN";
    return new _M0DTPB4Json6String(_p);
  } else {
    if (self > $i64_reinterpret_f64(9218868437227405311n)) {
      const _p = "Infinity";
      return new _M0DTPB4Json6String(_p);
    } else {
      if (self < $i64_reinterpret_f64(18442240474082181119n)) {
        const _p = "-Infinity";
        return new _M0DTPB4Json6String(_p);
      } else {
        const _p = undefined;
        return new _M0DTPB4Json6Number(self, _p);
      }
    }
  }
}
function _M0IPC15array5ArrayPB6ToJson8to__jsonGRPB4JsonE(self) {
  const _p = new Array(self.length);
  const _p$2 = self.length;
  let _tmp = 0;
  while (true) {
    const _p$3 = _tmp;
    if (_p$3 < _p$2) {
      const _p$4 = self[_p$3];
      _p[_p$3] = _p$4;
      _tmp = _p$3 + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPB4Json5Array(_p);
}
function _M0IPC15array5ArrayPB6ToJson8to__jsonGsE(self) {
  const _p = new Array(self.length);
  const _p$2 = self.length;
  let _tmp = 0;
  while (true) {
    const _p$3 = _tmp;
    if (_p$3 < _p$2) {
      const _p$4 = self[_p$3];
      _p[_p$3] = new _M0DTPB4Json6String(_p$4);
      _tmp = _p$3 + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPB4Json5Array(_p);
}
function _M0IPC15array5ArrayPB6ToJson8to__jsonGiE(self) {
  const _p = new Array(self.length);
  const _p$2 = self.length;
  let _tmp = 0;
  while (true) {
    const _p$3 = _tmp;
    if (_p$3 < _p$2) {
      const _p$4 = self[_p$3];
      _p[_p$3] = _M0IPC13int3IntPB6ToJson8to__json(_p$4);
      _tmp = _p$3 + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPB4Json5Array(_p);
}
function _M0IPC15array5ArrayPB6ToJson8to__jsonGRPB5ArrayGiEE(self) {
  const _p = new Array(self.length);
  const _p$2 = self.length;
  let _tmp = 0;
  while (true) {
    const _p$3 = _tmp;
    if (_p$3 < _p$2) {
      const _p$4 = self[_p$3];
      _p[_p$3] = _M0IPC15array5ArrayPB6ToJson8to__jsonGiE(_p$4);
      _tmp = _p$3 + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPB4Json5Array(_p);
}
function _M0MPB5Iter24nextGiRPB5ArrayGsEE(self) {
  return _M0MPB4Iter4nextGUsRPB4JsonEE(self);
}
function _M0MPB5Iter24nextGsRPB4JsonE(self) {
  return _M0MPB4Iter4nextGUsRPB4JsonEE(self);
}
function _M0IPC16string6StringPB4Hash4hash(self) {
  let acc = (_M0FPB4seed >>> 0) + (374761393 >>> 0) | 0;
  const _bind = self.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      acc = (acc >>> 0) + (4 >>> 0) | 0;
      const v = self.charCodeAt(i);
      acc = _M0FPB13consume4__acc(acc, v);
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0FPB13finalize__acc(acc);
}
function _M0IPC13int3IntPB4Hash4hash(self) {
  const acc = (((_M0FPB4seed >>> 0) + (374761393 >>> 0) | 0) >>> 0) + (4 >>> 0) | 0;
  return _M0FPB13finalize__acc(_M0FPB13consume4__acc(acc, self));
}
function _M0MPC16double6Double7to__int(self) {
  return self !== self ? 0 : self >= 2147483647 ? 2147483647 : self <= -2147483648 ? -2147483648 : self | 0;
}
function _M0IPC16double6DoublePB4Show10to__string(self) {
  return String(self);
}
function _M0MPC15bytes5Bytes11from__array(arr) {
  const len = arr.end - arr.start | 0;
  if (len === 0) {
    return $bytes_literal$0;
  }
  const result = _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(arr.buf, len, arr.start, 0, len);
  return result;
}
function _M0MPC15array5Array11unsafe__popGRPC14json10WriteFrameE(self) {
  return _M0MPB7JSArray3pop(self);
}
function _M0MPC15array5Array11unsafe__popGiE(self) {
  return _M0MPB7JSArray3pop(self);
}
function _M0MPC15array5Array3popGRPC14json10WriteFrameE(self) {
  if (self.length === 0) {
    return undefined;
  } else {
    const v = _M0MPC15array5Array11unsafe__popGRPC14json10WriteFrameE(self);
    return v;
  }
}
function _M0MPC15array5Array3popGiE(self) {
  if (self.length === 0) {
    return undefined;
  } else {
    const v = _M0MPC15array5Array11unsafe__popGiE(self);
    return v;
  }
}
function _M0MPC15array5Array4copyGsE(self) {
  return _M0MPB7JSArray4copy(self);
}
function _M0MPC15array5Array2atGRPB4JsonE(self, index) {
  const len = self.length;
  return index >= 0 && index < len ? self[index] : $panic();
}
function _M0MPC15array5Array2atGjE(self, index) {
  const len = self.length;
  return index >= 0 && index < len ? self[index] : $panic();
}
function _M0MPC15array5Array2atGiE(self, index) {
  const len = self.length;
  return index >= 0 && index < len ? self[index] : $panic();
}
function _M0MPC15array12MutArrayView4swapGsE(arr, i, j) {
  const temp = arr.buf[arr.start + i | 0];
  arr.buf[arr.start + i | 0] = arr.buf[arr.start + j | 0];
  arr.buf[arr.start + j | 0] = temp;
}
function _M0MPC15array12MutArrayView5sliceGsE(arr, start, end) {
  const _bind = arr.end - arr.start | 0;
  if (start < 0 || (start > end || end > _bind)) {
    $panic();
  }
  return new _M0TPB12MutArrayViewGsE(arr.buf, start + arr.start | 0, end + arr.start | 0);
}
function _M0MPC15array5Array3setGjE(self, index, value) {
  const len = self.length;
  if (index >= 0 && index < len) {
    self[index] = value;
    return;
  } else {
    $panic();
    return;
  }
}
function _M0MPC15array5Array3setGiE(self, index, value) {
  const len = self.length;
  if (index >= 0 && index < len) {
    self[index] = value;
    return;
  } else {
    $panic();
    return;
  }
}
function _M0MPC15array12MutArrayView14rev__in__placeGsE(arr) {
  const len = arr.end - arr.start | 0;
  const mid_len = len / 2 | 0;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < mid_len) {
      const j = (len - i | 0) - 1 | 0;
      const temp = arr.buf[arr.start + i | 0];
      arr.buf[arr.start + i | 0] = arr.buf[arr.start + j | 0];
      arr.buf[arr.start + j | 0] = temp;
      _tmp = i + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FPB17fixed__get__limit(len) {
  let _tmp = len;
  let _tmp$2 = 0;
  while (true) {
    const len$2 = _tmp;
    const limit = _tmp$2;
    if (len$2 > 0) {
      _tmp = len$2 / 2 | 0;
      _tmp$2 = limit + 1 | 0;
      continue;
    } else {
      return limit;
    }
  }
}
function _M0FPB23fixed__bubble__sort__byGsE(arr, cmp) {
  const _bind = arr.end - arr.start | 0;
  let _tmp = 1;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      let _tmp$2 = i;
      while (true) {
        const j = _tmp$2;
        if (j > 0 && cmp(arr.buf[arr.start + (j - 1 | 0) | 0], arr.buf[arr.start + j | 0]) > 0) {
          _M0MPC15array12MutArrayView4swapGsE(arr, j, j - 1 | 0);
          _tmp$2 = j - 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FPB24fixed__choose__pivot__byN7sort__2S1760GsE(_env, a, b) {
  const arr = _env._2;
  const swaps = _env._1;
  const cmp = _env._0;
  if (cmp(arr.buf[arr.start + a | 0], arr.buf[arr.start + b | 0]) > 0) {
    _M0MPC15array12MutArrayView4swapGsE(arr, a, b);
    swaps.val = swaps.val + 1 | 0;
    return;
  } else {
    return;
  }
}
function _M0FPB24fixed__choose__pivot__byN7sort__3S1761GsE(_env, a, b, c) {
  _M0FPB24fixed__choose__pivot__byN7sort__2S1760GsE(_env, a, b);
  _M0FPB24fixed__choose__pivot__byN7sort__2S1760GsE(_env, b, c);
  _M0FPB24fixed__choose__pivot__byN7sort__2S1760GsE(_env, a, b);
}
function _M0FPB24fixed__choose__pivot__byGsE(arr, cmp) {
  const len = arr.end - arr.start | 0;
  const swaps = new _M0TPB8MutLocalGiE(0);
  const b = Math.imul(len / 4 | 0, 2) | 0;
  if (len >= 8) {
    const a = Math.imul(len / 4 | 0, 1) | 0;
    const c = Math.imul(len / 4 | 0, 3) | 0;
    const _env = { _0: cmp, _1: swaps, _2: arr };
    if (len > 50) {
      _M0FPB24fixed__choose__pivot__byN7sort__3S1761GsE(_env, a - 1 | 0, a, a + 1 | 0);
      _M0FPB24fixed__choose__pivot__byN7sort__3S1761GsE(_env, b - 1 | 0, b, b + 1 | 0);
      _M0FPB24fixed__choose__pivot__byN7sort__3S1761GsE(_env, c - 1 | 0, c, c + 1 | 0);
    }
    _M0FPB24fixed__choose__pivot__byN7sort__3S1761GsE(_env, a, b, c);
  }
  if (swaps.val === 12) {
    _M0MPC15array12MutArrayView14rev__in__placeGsE(arr);
    return { _0: (len - b | 0) - 1 | 0, _1: true };
  } else {
    return { _0: b, _1: swaps.val === 0 };
  }
}
function _M0FPB21fixed__sift__down__byGsE(arr, index, cmp) {
  const len = arr.end - arr.start | 0;
  let _tmp = index;
  let _tmp$2 = (Math.imul(index, 2) | 0) + 1 | 0;
  while (true) {
    const index$2 = _tmp;
    const child = _tmp$2;
    if (child < len) {
      const child$2 = (child + 1 | 0) < len && cmp(arr.buf[arr.start + child | 0], arr.buf[arr.start + (child + 1 | 0) | 0]) < 0 ? child + 1 | 0 : child;
      if (cmp(arr.buf[arr.start + index$2 | 0], arr.buf[arr.start + child$2 | 0]) >= 0) {
        return undefined;
      }
      _M0MPC15array12MutArrayView4swapGsE(arr, index$2, child$2);
      _tmp = child$2;
      _tmp$2 = (Math.imul(child$2, 2) | 0) + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FPB21fixed__heap__sort__byGsE(arr, cmp) {
  const len = arr.end - arr.start | 0;
  const _bind = len / 2 | 0;
  let _tmp = _bind - 1 | 0;
  while (true) {
    const i = _tmp;
    if (i >= 0) {
      _M0FPB21fixed__sift__down__byGsE(arr, i, cmp);
      _tmp = i - 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let _tmp$2 = len - 1 | 0;
  while (true) {
    const i = _tmp$2;
    if (i >= 1) {
      _M0MPC15array12MutArrayView4swapGsE(arr, 0, i);
      _M0FPB21fixed__sift__down__byGsE(_M0MPC15array12MutArrayView5sliceGsE(arr, 0, i), 0, cmp);
      _tmp$2 = i - 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FPB20fixed__partition__byGsE(arr, cmp, pivot_index) {
  _M0MPC15array12MutArrayView4swapGsE(arr, pivot_index, (arr.end - arr.start | 0) - 1 | 0);
  const pivot = arr.buf[arr.start + ((arr.end - arr.start | 0) - 1 | 0) | 0];
  const _bind = (arr.end - arr.start | 0) - 1 | 0;
  let _tmp = 0;
  let _tmp$2 = 0;
  let _tmp$3 = true;
  while (true) {
    const j = _tmp;
    const i = _tmp$2;
    const partitioned = _tmp$3;
    if (j < _bind) {
      if (cmp(arr.buf[arr.start + j | 0], pivot) < 0) {
        if (i !== j) {
          _M0MPC15array12MutArrayView4swapGsE(arr, i, j);
          _tmp = j + 1 | 0;
          _tmp$2 = i + 1 | 0;
          _tmp$3 = false;
          continue;
        } else {
          _tmp = j + 1 | 0;
          _tmp$2 = i + 1 | 0;
          continue;
        }
      } else {
        _tmp = j + 1 | 0;
        continue;
      }
    } else {
      _M0MPC15array12MutArrayView4swapGsE(arr, i, (arr.end - arr.start | 0) - 1 | 0);
      return { _0: i, _1: partitioned };
    }
  }
}
function _M0FPB28fixed__try__bubble__sort__byGsE(arr, cmp) {
  const _bind = arr.end - arr.start | 0;
  let _tmp = 1;
  let _tmp$2 = 0;
  while (true) {
    const i = _tmp;
    const tries = _tmp$2;
    if (i < _bind) {
      let sorted;
      let _tmp$3 = i;
      let _tmp$4 = true;
      while (true) {
        const j = _tmp$3;
        const sorted$2 = _tmp$4;
        if (j > 0 && cmp(arr.buf[arr.start + (j - 1 | 0) | 0], arr.buf[arr.start + j | 0]) > 0) {
          _M0MPC15array12MutArrayView4swapGsE(arr, j, j - 1 | 0);
          _tmp$3 = j - 1 | 0;
          _tmp$4 = false;
          continue;
        } else {
          sorted = sorted$2;
          break;
        }
      }
      if (!sorted) {
        const tries$2 = tries + 1 | 0;
        if (tries$2 > 8) {
          return false;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = tries$2;
        continue;
      } else {
        _tmp = i + 1 | 0;
        continue;
      }
    } else {
      return true;
    }
  }
}
function _M0FPB22fixed__quick__sort__byGsE(arr, cmp, pred, limit) {
  let _tmp = limit;
  let _tmp$2 = arr;
  let _tmp$3 = pred;
  let _tmp$4 = true;
  let _tmp$5 = true;
  while (true) {
    const limit$2 = _tmp;
    const arr$2 = _tmp$2;
    const pred$2 = _tmp$3;
    const was_partitioned = _tmp$4;
    const balanced = _tmp$5;
    const len = arr$2.end - arr$2.start | 0;
    if (len <= 16) {
      if (len >= 2) {
        _M0FPB23fixed__bubble__sort__byGsE(arr$2, cmp);
      }
      return undefined;
    }
    if (limit$2 === 0) {
      _M0FPB21fixed__heap__sort__byGsE(arr$2, cmp);
      return undefined;
    }
    const _bind = _M0FPB24fixed__choose__pivot__byGsE(arr$2, cmp);
    const _pivot_index = _bind._0;
    const _likely_sorted = _bind._1;
    if (was_partitioned && (balanced && _likely_sorted)) {
      if (_M0FPB28fixed__try__bubble__sort__byGsE(arr$2, cmp)) {
        return undefined;
      }
    }
    const _bind$2 = _M0FPB20fixed__partition__byGsE(arr$2, cmp, _pivot_index);
    const _pivot = _bind$2._0;
    const _partitioned = _bind$2._1;
    const _p = len - _pivot | 0;
    const balanced$2 = (_pivot > _p ? _p : _pivot) >= (len / 8 | 0);
    const limit$3 = !balanced$2 ? limit$2 - 1 | 0 : limit$2;
    if (pred$2 === undefined) {
    } else {
      const _Some = pred$2;
      const _p$2 = _Some;
      if (cmp(_p$2, arr$2.buf[arr$2.start + _pivot | 0]) === 0) {
        let i;
        let _tmp$6 = _pivot;
        while (true) {
          const i$2 = _tmp$6;
          if (i$2 < len && cmp(_p$2, arr$2.buf[arr$2.start + i$2 | 0]) === 0) {
            _tmp$6 = i$2 + 1 | 0;
            continue;
          } else {
            i = i$2;
            break;
          }
        }
        _tmp = limit$3;
        _tmp$2 = _M0MPC15array12MutArrayView5sliceGsE(arr$2, i, len);
        _tmp$4 = _partitioned;
        _tmp$5 = balanced$2;
        continue;
      }
    }
    const left = _M0MPC15array12MutArrayView5sliceGsE(arr$2, 0, _pivot);
    const right = _M0MPC15array12MutArrayView5sliceGsE(arr$2, _pivot + 1 | 0, len);
    if ((left.end - left.start | 0) < (right.end - right.start | 0)) {
      _M0FPB22fixed__quick__sort__byGsE(left, cmp, pred$2, limit$3);
      _tmp = limit$3;
      _tmp$2 = right;
      _tmp$3 = arr$2.buf[arr$2.start + _pivot | 0];
      _tmp$4 = _partitioned;
      _tmp$5 = balanced$2;
      continue;
    } else {
      _M0FPB22fixed__quick__sort__byGsE(right, cmp, arr$2.buf[arr$2.start + _pivot | 0], limit$3);
      _tmp = limit$3;
      _tmp$2 = left;
      _tmp$4 = _partitioned;
      _tmp$5 = balanced$2;
      continue;
    }
  }
}
function _M0MPC15array12MutArrayView13sort__by__keyGUmsEmE(self, map) {
  _M0FPB22fixed__quick__sort__byGsE(self, (a, b) => $compare_uint64(map(a), map(b)), undefined, _M0FPB17fixed__get__limit(self.end - self.start | 0));
}
function _M0MPC15array12MutArrayView8sort__byGsE(self, cmp) {
  _M0FPB22fixed__quick__sort__byGsE(self, cmp, undefined, _M0FPB17fixed__get__limit(self.end - self.start | 0));
}
function _M0MPC15array5Array13sort__by__keyGUmsEmE(self, map) {
  const _bind = self.length;
  _M0MPC15array12MutArrayView13sort__by__keyGUmsEmE(new _M0TPB12MutArrayViewGUmsEE(self, 0, _bind), map);
}
function _M0MPC15array5Array8sort__byGsE(self, cmp) {
  const _bind = self.length;
  _M0MPC15array12MutArrayView8sort__byGsE(new _M0TPB12MutArrayViewGsE(self, 0, _bind), cmp);
}
function _M0MPC15array5Array4makeGjE(len, elem) {
  const arr = new Array(len);
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < len) {
      arr[i] = elem;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return arr;
}
function _M0MPC15array5Array4makeGiE(len, elem) {
  const arr = new Array(len);
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < len) {
      arr[i] = elem;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return arr;
}
function _M0IPC15array5ArrayPB2Eq5equalGRPB4JsonE(self, other) {
  const self_len = self.length;
  const other_len = other.length;
  if (self_len === other_len) {
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < self_len) {
        if (_M0IPC14json4JsonPB2Eq5equal(self[i], other[i])) {
        } else {
          return false;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
}
function _M0MPC15array5Array8containsGsE(self, value) {
  const _bind = self.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const v = self[_];
      if (v === value) {
        return true;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      return false;
    }
  }
}
function _M0FPC28encoding4utf814encode_2einner(str, bom) {
  return _M0FPC28encoding4utf816encode__utf8__js(str.str, str.start, str.end - str.start | 0, bom);
}
function _M0FPC28internal7strconv10range__errGuE() {
  return new _M0DTPC16result6ResultGuRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv15range__err__str));
}
function _M0FPC28internal7strconv11syntax__errGdE() {
  return new _M0DTPC16result6ResultGdRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
}
function _M0FPC28internal7strconv11syntax__errGORPC28internal7strconv6NumberE() {
  return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
}
function _M0FPC28internal7strconv11syntax__errGuE() {
  return new _M0DTPC16result6ResultGuRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
}
function _M0FPC28internal7strconv11syntax__errGRPC16string10StringViewE() {
  return new _M0DTPC16result6ResultGRPC16string10StringViewRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
}
function _M0EPC16string10StringViewPC28internal7strconv12fold__digitsGmE(self, init, f) {
  let _tmp = self;
  let _tmp$2 = init;
  let _tmp$3 = 0;
  while (true) {
    const str = _tmp;
    const ret = _tmp$2;
    const len = _tmp$3;
    _L: {
      if ((str.end - str.start | 0) >= 1) {
        const _x = str.str.charCodeAt(str.start);
        if (_x >= 48 && _x <= 57) {
          const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
          _tmp = _x$2;
          _tmp$2 = f(_x - 48 | 0, ret);
          _tmp$3 = len + 1 | 0;
          continue;
        } else {
          if (_x === 95) {
            const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
            _tmp = _x$2;
            continue;
          } else {
            break _L;
          }
        }
      } else {
        break _L;
      }
    }
    return { _0: str, _1: ret, _2: len };
  }
}
function _M0FPC28internal7strconv13parse__digits(s, x) {
  return _M0EPC16string10StringViewPC28internal7strconv12fold__digitsGmE(s, x, (digit, acc) => BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + BigInt.asUintN(64, BigInt(digit >>> 0))));
}
function _M0FPC28internal7strconv20try__parse__19digits(s, x) {
  let x$2 = x;
  let len = 0;
  let _tmp = s;
  while (true) {
    const s$2 = _tmp;
    let s$3;
    _L: {
      if ((s$2.end - s$2.start | 0) >= 1) {
        const _x = s$2.str.charCodeAt(s$2.start);
        if (_x >= 48 && _x <= 57) {
          const _x$2 = new _M0TPC16string10StringView(s$2.str, s$2.start + 1 | 0, s$2.end);
          if (BigInt.asUintN(64, x$2) < BigInt.asUintN(64, _M0FPC28internal7strconv17min__19digit__int)) {
            len = len + 1 | 0;
            x$2 = BigInt.asUintN(64, BigInt.asUintN(64, x$2 * 10n) + BigInt.asUintN(64, BigInt((_x - 48 | 0) >>> 0)));
            _tmp = _x$2;
            continue;
          } else {
            s$3 = s$2;
            break _L;
          }
        } else {
          if (_x === 95) {
            const _x$2 = new _M0TPC16string10StringView(s$2.str, s$2.start + 1 | 0, s$2.end);
            _tmp = _x$2;
            continue;
          } else {
            s$3 = s$2;
            break _L;
          }
        }
      } else {
        s$3 = s$2;
        break _L;
      }
    }
    return { _0: s$3, _1: x$2, _2: len };
  }
}
function _M0FPC28internal7strconv17parse__scientific(s) {
  let s$2 = s;
  let neg_exp = false;
  let rest;
  let ch;
  _L: {
    _L$2: {
      const _bind = s$2;
      if ((_bind.end - _bind.start | 0) >= 1) {
        const _x = _bind.str.charCodeAt(_bind.start);
        switch (_x) {
          case 43: {
            const _x$2 = new _M0TPC16string10StringView(_bind.str, _bind.start + 1 | 0, _bind.end);
            rest = _x$2;
            ch = _x;
            break _L$2;
          }
          case 45: {
            const _x$3 = new _M0TPC16string10StringView(_bind.str, _bind.start + 1 | 0, _bind.end);
            rest = _x$3;
            ch = _x;
            break _L$2;
          }
        }
      }
      break _L;
    }
    neg_exp = ch === 45;
    s$2 = rest;
  }
  _L$2: {
    const _bind = s$2;
    if ((_bind.end - _bind.start | 0) >= 1) {
      const _x = _bind.str.charCodeAt(_bind.start);
      if (_x >= 48 && _x <= 57) {
        const _bind$2 = _M0EPC16string10StringViewPC28internal7strconv12fold__digitsGmE(s$2, _M0FPC28internal7strconv17parse__scientificN8exp__numS2164, (digit, exp_num) => BigInt.asIntN(64, exp_num) < BigInt.asIntN(64, 65536n) ? BigInt.asUintN(64, BigInt.asUintN(64, 10n * exp_num) + BigInt.asUintN(64, BigInt(digit))) : exp_num);
        const _s = _bind$2._0;
        const _exp_num = _bind$2._1;
        return neg_exp ? { _0: _s, _1: BigInt.asUintN(64, -_exp_num) } : { _0: _s, _1: _exp_num };
      } else {
        break _L$2;
      }
    } else {
      break _L$2;
    }
  }
  return undefined;
}
function _M0FPC28internal7strconv13parse__number(s) {
  let s$2;
  let negative;
  _L: {
    let rest;
    _L$2: {
      if ((s.end - s.start | 0) >= 1) {
        const _x = s.str.charCodeAt(s.start);
        switch (_x) {
          case 45: {
            const _x$2 = new _M0TPC16string10StringView(s.str, s.start + 1 | 0, s.end);
            s$2 = _x$2;
            negative = true;
            break _L;
          }
          case 43: {
            const _x$3 = new _M0TPC16string10StringView(s.str, s.start + 1 | 0, s.end);
            rest = _x$3;
            break _L$2;
          }
          default: {
            rest = s;
            break _L$2;
          }
        }
      } else {
        rest = s;
        break _L$2;
      }
    }
    s$2 = rest;
    negative = false;
    break _L;
  }
  if ((s$2.end - s$2.start | 0) === 0) {
    return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
  }
  const _bind = _M0FPC28internal7strconv13parse__digits(s$2, 0n);
  const _s = _bind._0;
  const _mantissa = _bind._1;
  const _consumed = _bind._2;
  let mantissa = _mantissa;
  let s$3 = _s;
  let n_digits = _consumed;
  let n_after_dot = 0;
  let exponent = 0n;
  const _bind$2 = s$3;
  if ((_bind$2.end - _bind$2.start | 0) >= 1) {
    const _x = _bind$2.str.charCodeAt(_bind$2.start);
    if (_x === 46) {
      const _x$2 = new _M0TPC16string10StringView(_bind$2.str, _bind$2.start + 1 | 0, _bind$2.end);
      s$3 = _x$2;
      const _bind$3 = _M0FPC28internal7strconv13parse__digits(s$3, mantissa);
      const _new_s = _bind$3._0;
      const _new_mantissa = _bind$3._1;
      const _consumed_digit = _bind$3._2;
      s$3 = _new_s;
      mantissa = _new_mantissa;
      n_after_dot = _consumed_digit;
      exponent = BigInt.asUintN(64, -BigInt.asUintN(64, BigInt(n_after_dot)));
    }
  }
  n_digits = n_digits + n_after_dot | 0;
  if (n_digits === 0) {
    return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
  }
  let exp_number = 0n;
  let rest;
  _L$2: {
    _L$3: {
      const _bind$3 = s$3;
      if ((_bind$3.end - _bind$3.start | 0) >= 1) {
        const _x = _bind$3.str.charCodeAt(_bind$3.start);
        switch (_x) {
          case 101: {
            const _x$2 = new _M0TPC16string10StringView(_bind$3.str, _bind$3.start + 1 | 0, _bind$3.end);
            rest = _x$2;
            break _L$3;
          }
          case 69: {
            const _x$3 = new _M0TPC16string10StringView(_bind$3.str, _bind$3.start + 1 | 0, _bind$3.end);
            rest = _x$3;
            break _L$3;
          }
        }
      }
      break _L$2;
    }
    const _bind$3 = _M0FPC28internal7strconv17parse__scientific(rest);
    let _bind$4;
    if (_bind$3 === undefined) {
      return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
    } else {
      const _Some = _bind$3;
      _bind$4 = _Some;
    }
    const _new_s = _bind$4._0;
    const _exp_number_val = _bind$4._1;
    s$3 = _new_s;
    exp_number = _exp_number_val;
    exponent = BigInt.asUintN(64, exponent + exp_number);
  }
  const _bind$3 = s$3;
  if ((_bind$3.end - _bind$3.start | 0) === 0) {
    if (n_digits <= 19) {
      return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(new _M0TPC28internal7strconv6Number(exponent, mantissa, negative, false));
    }
    n_digits = n_digits - 19 | 0;
    let many_digits = false;
    let _tmp = s.str;
    let _tmp$2 = s.start;
    let _tmp$3 = s.end;
    _L$3: while (true) {
      const s_str = _tmp;
      const s_start = _tmp$2;
      const s_end = _tmp$3;
      _L$4: {
        let rest$2;
        let ch;
        _L$5: {
          if ((s_end - s_start | 0) >= 1) {
            const _x = s_str.charCodeAt(s_start);
            switch (_x) {
              case 48: {
                const _x$2 = new _M0TPC16string10StringView(s_str, s_start + 1 | 0, s_end);
                rest$2 = _x$2;
                ch = _x;
                break _L$5;
              }
              case 46: {
                const _x$3 = new _M0TPC16string10StringView(s_str, s_start + 1 | 0, s_end);
                rest$2 = _x$3;
                ch = _x;
                break _L$5;
              }
              default: {
                break _L$4;
              }
            }
          } else {
            break _L$4;
          }
        }
        n_digits = n_digits - ((ch - 46 | 0) / 2 | 0) | 0;
        _tmp = rest$2.str;
        _tmp$2 = rest$2.start;
        _tmp$3 = rest$2.end;
        continue;
      }
      break;
    }
    let mantissa$2 = mantissa;
    if (n_digits > 0) {
      many_digits = true;
      mantissa$2 = 0n;
      const _bind$4 = _M0FPC28internal7strconv20try__parse__19digits(s, mantissa$2);
      const _s$2 = _bind$4._0;
      const _new_mantissa = _bind$4._1;
      const _consumed_digit = _bind$4._2;
      mantissa$2 = _new_mantissa;
      let _tmp$4;
      if (BigInt.asUintN(64, mantissa$2) >= BigInt.asUintN(64, _M0FPC28internal7strconv17min__19digit__int)) {
        _tmp$4 = _consumed_digit;
      } else {
        if (_M0MPC16string6String24char__length__ge_2einner(_s$2.str, 1, _s$2.start, _s$2.end)) {
          const _tmp$5 = _s$2.str;
          const _bind$5 = _M0MPC16string6String29offset__of__nth__char_2einner(_s$2.str, 1, _s$2.start, _s$2.end);
          let _tmp$6;
          if (_bind$5 === undefined) {
            _tmp$6 = _s$2.end;
          } else {
            const _Some = _bind$5;
            _tmp$6 = _Some;
          }
          const _x = new _M0TPC16string10StringView(_tmp$5, _tmp$6, _s$2.end);
          const _bind$6 = _M0FPC28internal7strconv20try__parse__19digits(_x, mantissa$2);
          const _new_mantissa$2 = _bind$6._1;
          const _consumed_digit$2 = _bind$6._2;
          mantissa$2 = _new_mantissa$2;
          _tmp$4 = _consumed_digit$2;
        } else {
          return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
        }
      }
      exponent = BigInt.asUintN(64, BigInt(_tmp$4));
      exponent = BigInt.asUintN(64, exponent + exp_number);
    }
    return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(new _M0TPC28internal7strconv6Number(exponent, mantissa$2, negative, many_digits));
  } else {
    return _M0FPC28internal7strconv11syntax__errGORPC28internal7strconv6NumberE();
  }
}
function _M0FPC28internal7strconv15parse__inf__nan(rest) {
  let pos;
  let rest$2;
  _L: {
    let rest$3;
    _L$2: {
      if ((rest.end - rest.start | 0) >= 1) {
        const _x = rest.str.charCodeAt(rest.start);
        switch (_x) {
          case 45: {
            const _x$2 = new _M0TPC16string10StringView(rest.str, rest.start + 1 | 0, rest.end);
            pos = false;
            rest$2 = _x$2;
            break _L;
          }
          case 43: {
            const _x$3 = new _M0TPC16string10StringView(rest.str, rest.start + 1 | 0, rest.end);
            rest$3 = _x$3;
            break _L$2;
          }
          default: {
            rest$3 = rest;
            break _L$2;
          }
        }
      } else {
        rest$3 = rest;
        break _L$2;
      }
    }
    pos = true;
    rest$2 = rest$3;
    break _L;
  }
  let _cursor_295 = 0;
  const _input_end_297 = rest$2.end - rest$2.start | 0;
  const _start_296 = _cursor_295;
  let _accept_state_298 = -1;
  let _match_end_299 = -1;
  let _state_300 = 2;
  while (true) {
    if (_state_300 !== 14) {
      if (_state_300 < 2) {
        _accept_state_298 = _state_300;
        _match_end_299 = _cursor_295;
      }
      const _tmp = Math.imul(_state_300, 8) | 0;
      let _next_char_303;
      if (_cursor_295 < _input_end_297) {
        const _char_302 = rest$2.str.charCodeAt(rest$2.start + _cursor_295 | 0);
        _cursor_295 = _cursor_295 + 1 | 0;
        _next_char_303 = _char_302;
      } else {
        _next_char_303 = -1;
      }
      const _p = _tmp + (_next_char_303 < 90 ? (_next_char_303 < 73 ? (_next_char_303 < 66 ? (_next_char_303 < 0 ? 0 : _next_char_303 > 64 ? 1 : 7) : _next_char_303 > 69 ? (_next_char_303 < 71 ? 2 : 7) : 7) : _next_char_303 > 73 ? (_next_char_303 < 84 ? (_next_char_303 < 78 ? 7 : _next_char_303 > 78 ? 7 : 4) : _next_char_303 > 84 ? (_next_char_303 < 89 ? 7 : 6) : 5) : 3) : _next_char_303 > 96 ? (_next_char_303 < 110 ? (_next_char_303 < 103 ? (_next_char_303 < 98 ? 1 : _next_char_303 > 101 ? 2 : 7) : _next_char_303 > 104 ? (_next_char_303 < 106 ? 3 : 7) : 7) : _next_char_303 > 110 ? (_next_char_303 < 117 ? (_next_char_303 < 116 ? 7 : 5) : _next_char_303 > 120 ? (_next_char_303 < 122 ? 6 : 7) : 7) : 4) : 7) | 0;
      _state_300 = _M0FPC28internal7strconv15parse__inf__nanN25_2atransition__table__304S2243[_p];
      continue;
    } else {
      break;
    }
  }
  const _bind = _accept_state_298;
  switch (_bind) {
    case 0: {
      _cursor_295 = _match_end_299;
      return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_M0FPC16double14not__a__number);
    }
    case 1: {
      _cursor_295 = _match_end_299;
      return pos ? new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_M0FPC16double8infinity) : new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_M0FPC16double13neg__infinity);
    }
    default: {
      _cursor_295 = _start_296;
      return _M0FPC28internal7strconv11syntax__errGdE();
    }
  }
}
function _M0FPC28internal7strconv12checked__mul(a, b) {
  if (BigInt.asUintN(64, a) === BigInt.asUintN(64, 0n) || BigInt.asUintN(64, b) === BigInt.asUintN(64, 0n)) {
    return _M0FPC28internal7strconv12checked__mulN6constrS2263;
  }
  if (BigInt.asUintN(64, a) === BigInt.asUintN(64, 1n)) {
    return b;
  }
  if (BigInt.asUintN(64, b) === BigInt.asUintN(64, 1n)) {
    return a;
  }
  if ($i64_clz(b) === 0 || $i64_clz(a) === 0) {
    return undefined;
  }
  if (b === 0n) {
    $panic();
  }
  const quotient = BigInt.asUintN(64, BigInt.asUintN(64, 18446744073709551615n) / BigInt.asUintN(64, b));
  if (BigInt.asUintN(64, a) > BigInt.asUintN(64, quotient)) {
    return undefined;
  }
  return BigInt.asUintN(64, a * b);
}
function _M0FPC28internal7strconv17check__underscore(str) {
  const _p = 95;
  if (_M0MPC16string10StringView20contains__code__unit(str, _p)) {
    let rest;
    if ((str.end - str.start | 0) >= 1) {
      const _x = str.str.charCodeAt(str.start);
      switch (_x) {
        case 43: {
          const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
          rest = _x$2;
          break;
        }
        case 45: {
          const _x$3 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
          rest = _x$3;
          break;
        }
        default: {
          rest = str;
        }
      }
    } else {
      rest = str;
    }
    let rest$2;
    let allow_underscore;
    let hex;
    _L: {
      let _cursor_213 = 0;
      const _input_end_215 = rest.end - rest.start | 0;
      const _start_214 = _cursor_213;
      let _accept_state_216 = -1;
      let _match_end_217 = -1;
      let _state_218 = 3;
      while (true) {
        if (_state_218 !== 5) {
          if (_state_218 < 3) {
            _accept_state_216 = _state_218;
            _match_end_217 = _cursor_213;
          }
          const _tmp = Math.imul(_state_218, 5) | 0;
          let _next_char_221;
          if (_cursor_213 < _input_end_215) {
            const _char_220 = rest.str.charCodeAt(rest.start + _cursor_213 | 0);
            _cursor_213 = _cursor_213 + 1 | 0;
            _next_char_221 = _char_220;
          } else {
            _next_char_221 = -1;
          }
          const _p$2 = _tmp + (_next_char_221 < 88 ? (_next_char_221 < 66 ? (_next_char_221 < 48 ? 4 : _next_char_221 > 48 ? 4 : 0) : _next_char_221 > 66 ? (_next_char_221 < 79 ? 4 : _next_char_221 > 79 ? 4 : 2) : 1) : _next_char_221 > 88 ? (_next_char_221 < 111 ? (_next_char_221 < 98 ? 4 : _next_char_221 > 98 ? 4 : 1) : _next_char_221 > 111 ? (_next_char_221 < 120 ? 4 : _next_char_221 > 120 ? 4 : 3) : 2) : 3) | 0;
          _state_218 = _M0FPC28internal7strconv17check__underscoreN25_2atransition__table__222S2267[_p$2];
          continue;
        } else {
          break;
        }
      }
      const _bind = _accept_state_216;
      switch (_bind) {
        case 0: {
          _cursor_213 = _match_end_217;
          const rest$3 = _M0MPC16string10StringView12view_2einner(rest, _match_end_217, _input_end_215);
          rest$2 = rest$3;
          allow_underscore = true;
          hex = false;
          break _L;
        }
        case 1: {
          _cursor_213 = _match_end_217;
          const rest$4 = _M0MPC16string10StringView12view_2einner(rest, _match_end_217, _input_end_215);
          rest$2 = rest$4;
          allow_underscore = true;
          hex = false;
          break _L;
        }
        case 2: {
          _cursor_213 = _match_end_217;
          const rest$5 = _M0MPC16string10StringView12view_2einner(rest, _match_end_217, _input_end_215);
          rest$2 = rest$5;
          allow_underscore = true;
          hex = true;
          break _L;
        }
        default: {
          _cursor_213 = _start_214;
          rest$2 = rest;
          allow_underscore = false;
          hex = false;
          break _L;
        }
      }
    }
    let _tmp = rest$2.str;
    let _tmp$2 = rest$2.start;
    let _tmp$3 = rest$2.end;
    let _tmp$4 = allow_underscore;
    let _tmp$5 = false;
    while (true) {
      const rest_str = _tmp;
      const rest_start = _tmp$2;
      const rest_end = _tmp$3;
      const allow_underscore$2 = _tmp$4;
      const follow_underscore = _tmp$5;
      let rest$3;
      _L$2: {
        _L$3: {
          let rest$4;
          _L$4: {
            _L$5: {
              let rest$5;
              _L$6: {
                let rest$6;
                _L$7: {
                  if ((rest_end - rest_start | 0) === 0) {
                    return true;
                  } else {
                    if ((rest_end - rest_start | 0) === 1) {
                      const _x = rest_str.charCodeAt(rest_start);
                      if (_x === 95) {
                        return false;
                      } else {
                        if (_x >= 48 && _x <= 57) {
                          const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                          rest$6 = _x$2;
                          break _L$7;
                        } else {
                          if (_x >= 97 && _x <= 102) {
                            const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                            if (hex) {
                              rest$5 = _x$2;
                              break _L$6;
                            } else {
                              if (_x === 101) {
                                if (follow_underscore === true) {
                                  break _L$5;
                                } else {
                                  rest$4 = _x$2;
                                  break _L$4;
                                }
                              } else {
                                if (follow_underscore === true) {
                                  break _L$3;
                                } else {
                                  rest$3 = _x$2;
                                  break _L$2;
                                }
                              }
                            }
                          } else {
                            if (_x >= 65 && _x <= 70) {
                              const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                              if (hex) {
                                rest$5 = _x$2;
                                break _L$6;
                              } else {
                                if (_x === 69) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (follow_underscore === true) {
                                    break _L$3;
                                  } else {
                                    rest$3 = _x$2;
                                    break _L$2;
                                  }
                                }
                              }
                            } else {
                              if (_x === 46) {
                                if (follow_underscore === true) {
                                  break _L$5;
                                } else {
                                  const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                  rest$4 = _x$2;
                                  break _L$4;
                                }
                              } else {
                                if (_x === 43) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (_x === 45) {
                                    if (follow_underscore === true) {
                                      break _L$5;
                                    } else {
                                      const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                      rest$4 = _x$2;
                                      break _L$4;
                                    }
                                  } else {
                                    if (follow_underscore === true) {
                                      break _L$3;
                                    } else {
                                      const _bind = _M0MPC16string6String29offset__of__nth__char_2einner(rest_str, 1, rest_start, rest_end);
                                      let _tmp$6;
                                      if (_bind === undefined) {
                                        _tmp$6 = rest_end;
                                      } else {
                                        const _Some = _bind;
                                        _tmp$6 = _Some;
                                      }
                                      const _x$2 = new _M0TPC16string10StringView(rest_str, _tmp$6, rest_end);
                                      rest$3 = _x$2;
                                      break _L$2;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      const _x = rest_str.charCodeAt(rest_start);
                      if (_x === 95) {
                        if (allow_underscore$2 === false) {
                          return false;
                        } else {
                          const _bind = rest_start + 1 | 0;
                          _tmp$2 = _bind;
                          _tmp$4 = false;
                          _tmp$5 = true;
                          continue;
                        }
                      } else {
                        if (_x >= 48 && _x <= 57) {
                          const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                          rest$6 = _x$2;
                          break _L$7;
                        } else {
                          if (_x >= 97 && _x <= 102) {
                            const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                            if (hex) {
                              rest$5 = _x$2;
                              break _L$6;
                            } else {
                              if (_x === 101) {
                                if (follow_underscore === true) {
                                  break _L$5;
                                } else {
                                  rest$4 = _x$2;
                                  break _L$4;
                                }
                              } else {
                                if (follow_underscore === true) {
                                  break _L$3;
                                } else {
                                  rest$3 = _x$2;
                                  break _L$2;
                                }
                              }
                            }
                          } else {
                            if (_x >= 65 && _x <= 70) {
                              const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                              if (hex) {
                                rest$5 = _x$2;
                                break _L$6;
                              } else {
                                if (_x === 69) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (follow_underscore === true) {
                                    break _L$3;
                                  } else {
                                    rest$3 = _x$2;
                                    break _L$2;
                                  }
                                }
                              }
                            } else {
                              if (_x === 46) {
                                if (follow_underscore === true) {
                                  break _L$5;
                                } else {
                                  const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                  rest$4 = _x$2;
                                  break _L$4;
                                }
                              } else {
                                if (_x === 43) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (_x === 45) {
                                    if (follow_underscore === true) {
                                      break _L$5;
                                    } else {
                                      const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                      rest$4 = _x$2;
                                      break _L$4;
                                    }
                                  } else {
                                    if (follow_underscore === true) {
                                      break _L$3;
                                    } else {
                                      const _bind = _M0MPC16string6String29offset__of__nth__char_2einner(rest_str, 1, rest_start, rest_end);
                                      let _tmp$6;
                                      if (_bind === undefined) {
                                        _tmp$6 = rest_end;
                                      } else {
                                        const _Some = _bind;
                                        _tmp$6 = _Some;
                                      }
                                      const _x$2 = new _M0TPC16string10StringView(rest_str, _tmp$6, rest_end);
                                      rest$3 = _x$2;
                                      break _L$2;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                _tmp = rest$6.str;
                _tmp$2 = rest$6.start;
                _tmp$3 = rest$6.end;
                _tmp$4 = true;
                _tmp$5 = false;
                continue;
              }
              _tmp = rest$5.str;
              _tmp$2 = rest$5.start;
              _tmp$3 = rest$5.end;
              _tmp$4 = true;
              _tmp$5 = false;
              continue;
            }
            return false;
          }
          _tmp = rest$4.str;
          _tmp$2 = rest$4.start;
          _tmp$3 = rest$4.end;
          _tmp$4 = false;
          _tmp$5 = false;
          continue;
        }
        return false;
      }
      _tmp = rest$3.str;
      _tmp$2 = rest$3.start;
      _tmp$3 = rest$3.end;
      _tmp$4 = false;
      _tmp$5 = false;
      continue;
    }
  } else {
    return true;
  }
}
function _M0FPC28internal7strconv14eisel__umul128(a, b) {
  const a_lo = BigInt.asUintN(64, a & 4294967295n);
  const a_hi = BigInt.asUintN(64, BigInt.asUintN(64, a) >> BigInt(32 & 63));
  const b_lo = BigInt.asUintN(64, b & 4294967295n);
  const b_hi = BigInt.asUintN(64, BigInt.asUintN(64, b) >> BigInt(32 & 63));
  const x = BigInt.asUintN(64, a_lo * b_lo);
  const y = BigInt.asUintN(64, BigInt.asUintN(64, a_hi * b_lo) + BigInt.asUintN(64, BigInt.asUintN(64, x) >> BigInt(32 & 63)));
  const z = BigInt.asUintN(64, BigInt.asUintN(64, a_lo * b_hi) + BigInt.asUintN(64, y & 4294967295n));
  const hi = BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, a_hi * b_hi) + BigInt.asUintN(64, BigInt.asUintN(64, y) >> BigInt(32 & 63))) + BigInt.asUintN(64, BigInt.asUintN(64, z) >> BigInt(32 & 63)));
  return new _M0TPC28internal7strconv12EiselProduct(BigInt.asUintN(64, a * b), hi);
}
function _M0FPC28internal7strconv20try__eisel__lemire64(mantissa, exponent, negative) {
  if (BigInt.asUintN(64, mantissa) === BigInt.asUintN(64, 0n)) {
    return negative ? $i64_reinterpret_f64(9223372036854775808n) : 0;
  }
  if (BigInt.asIntN(64, exponent) < BigInt.asIntN(64, 18446744073709551268n) || BigInt.asIntN(64, exponent) > BigInt.asIntN(64, 347n)) {
    return _M0FPC16double14not__a__number;
  }
  const exponent$2 = Number(BigInt.asIntN(32, exponent)) | 0;
  const table_index = Math.imul(exponent$2 - -348 | 0, 2) | 0;
  const pow_hi = table_index >>> 0 < _M0FPC28internal7strconv27eisel__lemire__pow10__table.length ? _M0FPC28internal7strconv27eisel__lemire__pow10__table[table_index] : $oob();
  const _p = table_index + 1 | 0;
  const pow_lo = _p >>> 0 < _M0FPC28internal7strconv27eisel__lemire__pow10__table.length ? _M0FPC28internal7strconv27eisel__lemire__pow10__table[_p] : $oob();
  const pow_exp2 = 1 + (Math.imul(exponent$2, 108853) >> 15) | 0;
  const leading_zeros = $i64_clz(mantissa);
  const normalized = BigInt.asUintN(64, mantissa << BigInt(leading_zeros & 63));
  let result_exp2 = ((pow_exp2 + 63 | 0) + 1023 | 0) - leading_zeros | 0;
  const product = _M0FPC28internal7strconv14eisel__umul128(normalized, pow_hi);
  let product_hi = product.hi;
  let product_lo = product.lo;
  if (BigInt.asUintN(64, BigInt.asUintN(64, product_hi & 511n)) === BigInt.asUintN(64, 511n) && BigInt.asUintN(64, BigInt.asUintN(64, product_lo + normalized)) < BigInt.asUintN(64, normalized)) {
    const wider = _M0FPC28internal7strconv14eisel__umul128(normalized, pow_lo);
    let merged_hi = product_hi;
    const merged_lo = BigInt.asUintN(64, product_lo + wider.hi);
    if (BigInt.asUintN(64, merged_lo) < BigInt.asUintN(64, product_lo)) {
      merged_hi = BigInt.asUintN(64, merged_hi + 1n);
    }
    if (BigInt.asUintN(64, BigInt.asUintN(64, merged_hi & 511n)) === BigInt.asUintN(64, 511n) && (BigInt.asUintN(64, BigInt.asUintN(64, merged_lo + 1n)) === BigInt.asUintN(64, 0n) && BigInt.asUintN(64, BigInt.asUintN(64, wider.lo + normalized)) < BigInt.asUintN(64, normalized))) {
      return _M0FPC16double14not__a__number;
    }
    product_hi = merged_hi;
    product_lo = merged_lo;
  }
  const top_bit = Number(BigInt.asIntN(32, BigInt.asUintN(64, BigInt.asUintN(64, product_hi) >> BigInt(63 & 63)))) | 0;
  let result_mantissa = BigInt.asUintN(64, BigInt.asUintN(64, product_hi) >> BigInt(top_bit + 9 & 63));
  result_exp2 = result_exp2 - (1 - top_bit | 0) | 0;
  if (BigInt.asUintN(64, product_lo) === BigInt.asUintN(64, 0n) && (BigInt.asUintN(64, BigInt.asUintN(64, product_hi & 511n)) === BigInt.asUintN(64, 0n) && BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa & 3n)) === BigInt.asUintN(64, 1n))) {
    return _M0FPC16double14not__a__number;
  }
  result_mantissa = BigInt.asUintN(64, result_mantissa + BigInt.asUintN(64, result_mantissa & 1n));
  result_mantissa = BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa) >> BigInt(1 & 63));
  if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa) >> BigInt(53 & 63))) > BigInt.asUintN(64, 0n)) {
    result_mantissa = BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa) >> BigInt(1 & 63));
    result_exp2 = result_exp2 + 1 | 0;
  }
  if (result_exp2 <= 0 || result_exp2 >= 2047) {
    return _M0FPC16double14not__a__number;
  }
  const exponent_bits = BigInt.asUintN(64, BigInt.asUintN(64, BigInt(result_exp2 >>> 0)) << BigInt(52 & 63));
  let result_bits = BigInt.asUintN(64, exponent_bits | BigInt.asUintN(64, result_mantissa & 4503599627370495n));
  if (negative) {
    result_bits = BigInt.asUintN(64, result_bits | 9223372036854775808n);
  }
  return $i64_reinterpret_f64(result_bits);
}
function _M0MPC28internal7strconv7Decimal9new__priv() {
  return new _M0TPC28internal7strconv7Decimal($makebytes(800, 0), 0, 0, false, false, 0);
}
function _M0MPC28internal7strconv7Decimal4trim(self) {
  while (true) {
    let _tmp;
    if (self.digits_num > 0) {
      const _tmp$2 = self.digits;
      const _tmp$3 = self.digits_num - 1 | 0;
      const _p = _tmp$3 >>> 0 < _tmp$2.length ? _tmp$2[_tmp$3] : $oob();
      const _p$2 = 0;
      _tmp = _p === _p$2;
    } else {
      _tmp = false;
    }
    if (_tmp) {
      self.digits_num = self.digits_num - 1 | 0;
      continue;
    } else {
      break;
    }
  }
  if (self.digits_num === 0) {
    self.decimal_point = 0;
    return;
  } else {
    return;
  }
}
function _M0FPC28internal7strconv26parse__decimal__from__view(str) {
  const d = _M0MPC28internal7strconv7Decimal9new__priv();
  let has_dp = false;
  let has_digits = false;
  let rest;
  _L: {
    _L$2: {
      if ((str.end - str.start | 0) >= 1) {
        const _x = str.str.charCodeAt(str.start);
        switch (_x) {
          case 45: {
            const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
            d.negative = true;
            rest = _x$2;
            break;
          }
          case 43: {
            rest = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
            break;
          }
          default: {
            break _L$2;
          }
        }
      } else {
        break _L$2;
      }
      break _L;
    }
    rest = str;
  }
  let rest$2;
  let _tmp = rest;
  while (true) {
    const rest$3 = _tmp;
    let rest$4;
    _L$2: {
      _L$3: {
        if ((rest$3.end - rest$3.start | 0) >= 1) {
          const _x = rest$3.str.charCodeAt(rest$3.start);
          if (_x === 95) {
            const _x$2 = new _M0TPC16string10StringView(rest$3.str, rest$3.start + 1 | 0, rest$3.end);
            _tmp = _x$2;
            continue;
          } else {
            if (_x === 46) {
              const _x$2 = new _M0TPC16string10StringView(rest$3.str, rest$3.start + 1 | 0, rest$3.end);
              if (!has_dp) {
                has_dp = true;
                d.decimal_point = d.digits_num;
                _tmp = _x$2;
                continue;
              } else {
                const _bind = _M0FPC28internal7strconv11syntax__errGuE();
                if (_bind.$tag === 1) {
                  const _ok = _bind;
                  _ok._0;
                } else {
                  return _bind;
                }
              }
            } else {
              if (_x >= 48 && _x <= 57) {
                const _x$2 = new _M0TPC16string10StringView(rest$3.str, rest$3.start + 1 | 0, rest$3.end);
                has_digits = true;
                if (_x === 48 && d.digits_num === 0) {
                  d.decimal_point = d.decimal_point - 1 | 0;
                  _tmp = _x$2;
                  continue;
                }
                if (d.digits_num < d.digits.length) {
                  const _tmp$2 = d.digits;
                  const _tmp$3 = d.digits_num;
                  if (_tmp$3 >>> 0 < _tmp$2.length) {
                    _tmp$2[_tmp$3] = (_x - 48 | 0) & 255;
                  } else {
                    $oob();
                  }
                  d.digits_num = d.digits_num + 1 | 0;
                } else {
                  if (!has_dp) {
                    d.overflowed = d.overflowed + 1 | 0;
                  }
                  if (_x !== 48) {
                    d.truncated = true;
                  }
                }
                _tmp = _x$2;
                continue;
              } else {
                rest$4 = rest$3;
                break _L$3;
              }
            }
          }
        } else {
          rest$4 = rest$3;
          break _L$3;
        }
        break _L$2;
      }
      rest$2 = rest$4;
      break;
    }
    continue;
  }
  if (has_digits) {
    if (!has_dp) {
      d.decimal_point = d.digits_num;
    }
    let rest$3;
    let rest$4;
    _L$2: {
      _L$3: {
        if ((rest$2.end - rest$2.start | 0) >= 1) {
          const _x = rest$2.str.charCodeAt(rest$2.start);
          switch (_x) {
            case 101: {
              const _x$2 = new _M0TPC16string10StringView(rest$2.str, rest$2.start + 1 | 0, rest$2.end);
              rest$4 = _x$2;
              break _L$3;
            }
            case 69: {
              const _x$3 = new _M0TPC16string10StringView(rest$2.str, rest$2.start + 1 | 0, rest$2.end);
              rest$4 = _x$3;
              break _L$3;
            }
            default: {
              rest$3 = rest$2;
            }
          }
        } else {
          rest$3 = rest$2;
        }
        break _L$2;
      }
      let exp_sign = 1;
      let rest$5;
      if ((rest$4.end - rest$4.start | 0) >= 1) {
        const _x = rest$4.str.charCodeAt(rest$4.start);
        switch (_x) {
          case 43: {
            rest$5 = new _M0TPC16string10StringView(rest$4.str, rest$4.start + 1 | 0, rest$4.end);
            break;
          }
          case 45: {
            const _x$2 = new _M0TPC16string10StringView(rest$4.str, rest$4.start + 1 | 0, rest$4.end);
            exp_sign = -1;
            rest$5 = _x$2;
            break;
          }
          default: {
            rest$5 = rest$4;
          }
        }
      } else {
        rest$5 = rest$4;
      }
      _L$4: {
        _L$5: {
          if ((rest$5.end - rest$5.start | 0) >= 1) {
            const _x = rest$5.str.charCodeAt(rest$5.start);
            if (_x >= 48 && _x <= 57) {
              const effective_dp = d.decimal_point + d.overflowed | 0;
              const exp_limit = exp_sign > 0 ? (effective_dp < 311 ? 311 - effective_dp | 0 : 0) : effective_dp > -331 ? effective_dp + 331 | 0 : 0;
              let exp = 0;
              let rest$6;
              let _tmp$2 = rest$5;
              while (true) {
                const rest$7 = _tmp$2;
                let rest$8;
                _L$6: {
                  if ((rest$7.end - rest$7.start | 0) >= 1) {
                    const _x$2 = rest$7.str.charCodeAt(rest$7.start);
                    if (_x$2 === 95) {
                      const _x$3 = new _M0TPC16string10StringView(rest$7.str, rest$7.start + 1 | 0, rest$7.end);
                      _tmp$2 = _x$3;
                      continue;
                    } else {
                      if (_x$2 >= 48 && _x$2 <= 57) {
                        const _x$3 = new _M0TPC16string10StringView(rest$7.str, rest$7.start + 1 | 0, rest$7.end);
                        if (exp < exp_limit) {
                          exp = (Math.imul(exp, 10) | 0) + (_x$2 - 48 | 0) | 0;
                          if (exp > exp_limit) {
                            exp = exp_limit;
                          }
                        }
                        _tmp$2 = _x$3;
                        continue;
                      } else {
                        rest$8 = rest$7;
                        break _L$6;
                      }
                    }
                  } else {
                    rest$8 = rest$7;
                    break _L$6;
                  }
                }
                rest$6 = rest$8;
                break;
              }
              d.decimal_point = d.decimal_point + (Math.imul(exp_sign, exp) | 0) | 0;
              rest$3 = rest$6;
            } else {
              break _L$5;
            }
          } else {
            break _L$5;
          }
          break _L$4;
        }
        const _bind = _M0FPC28internal7strconv11syntax__errGRPC16string10StringViewE();
        if (_bind.$tag === 1) {
          const _ok = _bind;
          rest$3 = _ok._0;
        } else {
          return _bind;
        }
      }
    }
    if ((rest$3.end - rest$3.start | 0) === 0) {
      _M0MPC28internal7strconv7Decimal4trim(d);
      return new _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE2Ok(d);
    } else {
      return _M0FPC28internal7strconv11syntax__errGRPC16string10StringViewE();
    }
  } else {
    return _M0FPC28internal7strconv11syntax__errGRPC16string10StringViewE();
  }
}
function _M0FPC28internal7strconv20parse__decimal__priv(str) {
  return _M0FPC28internal7strconv26parse__decimal__from__view(str);
}
function _M0FPC28internal7strconv14assemble__bits(mantissa, exponent, negative) {
  const biased_exp = exponent - _M0FPC28internal7strconv12double__info.bias | 0;
  let bits = BigInt.asUintN(64, mantissa & BigInt.asUintN(64, BigInt.asUintN(64, 1n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)) - 1n));
  const exp_bits = BigInt.asUintN(64, BigInt(biased_exp & ((1 << _M0FPC28internal7strconv12double__info.exponent_bits) - 1 | 0)));
  bits = BigInt.asUintN(64, bits | BigInt.asUintN(64, exp_bits << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)));
  if (negative) {
    bits = BigInt.asUintN(64, bits | BigInt.asUintN(64, BigInt.asUintN(64, 1n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)) << BigInt(_M0FPC28internal7strconv12double__info.exponent_bits & 63)));
  }
  return bits;
}
function _M0MPC28internal7strconv7Decimal17should__round__up(self, d) {
  if (d < 0 || d >= self.digits_num) {
    return false;
  }
  let _tmp;
  const _tmp$2 = self.digits;
  if ((d >>> 0 < _tmp$2.length ? _tmp$2[d] : $oob()) === 5) {
    _tmp = (d + 1 | 0) === self.digits_num;
  } else {
    _tmp = false;
  }
  if (_tmp) {
    if (self.truncated) {
      return true;
    }
    let _tmp$3;
    if (d > 0) {
      const _tmp$4 = self.digits;
      const _tmp$5 = d - 1 | 0;
      _tmp$3 = ((_tmp$5 >>> 0 < _tmp$4.length ? _tmp$4[_tmp$5] : $oob()) % 2 | 0) !== 0;
    } else {
      _tmp$3 = false;
    }
    return _tmp$3;
  }
  const _tmp$3 = self.digits;
  return (d >>> 0 < _tmp$3.length ? _tmp$3[d] : $oob()) >= 5;
}
function _M0MPC28internal7strconv7Decimal16rounded__integer(self) {
  if (self.decimal_point > 20) {
    return 18446744073709551615n;
  }
  let _tmp = 0n;
  let _tmp$2 = 0;
  while (true) {
    const n = _tmp;
    const i = _tmp$2;
    if (i < self.decimal_point && i < self.digits_num) {
      const _tmp$3 = BigInt.asUintN(64, n * 10n);
      const _tmp$4 = self.digits;
      const _p = i >>> 0 < _tmp$4.length ? _tmp$4[i] : $oob();
      _tmp = BigInt.asUintN(64, _tmp$3 + BigInt.asUintN(64, BigInt(_p)));
      _tmp$2 = i + 1 | 0;
      continue;
    } else {
      let n$2;
      let _tmp$3 = n;
      let _tmp$4 = i;
      while (true) {
        const n$3 = _tmp$3;
        const i$2 = _tmp$4;
        if (i$2 < self.decimal_point) {
          _tmp$3 = BigInt.asUintN(64, n$3 * 10n);
          _tmp$4 = i$2 + 1 | 0;
          continue;
        } else {
          n$2 = n$3;
          break;
        }
      }
      return _M0MPC28internal7strconv7Decimal17should__round__up(self, self.decimal_point) ? BigInt.asUintN(64, n$2 + 1n) : n$2;
    }
  }
}
function _M0MPC28internal7strconv7Decimal11new__digits(self, s) {
  const new_digits = (s >>> 0 < _M0FPC28internal7strconv19left__shift__cheats.length ? _M0FPC28internal7strconv19left__shift__cheats[s] : $oob())._0;
  const cheat_num = (s >>> 0 < _M0FPC28internal7strconv19left__shift__cheats.length ? _M0FPC28internal7strconv19left__shift__cheats[s] : $oob())._1;
  const _bind = cheat_num.length;
  let less;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      const code_unit = cheat_num.charCodeAt(i);
      if (i >= self.digits_num) {
        less = true;
        break;
      }
      const d = code_unit - 48 | 0;
      const _tmp$2 = self.digits;
      if ((i >>> 0 < _tmp$2.length ? _tmp$2[i] : $oob()) !== d) {
        const _tmp$3 = self.digits;
        less = (i >>> 0 < _tmp$3.length ? _tmp$3[i] : $oob()) < d;
        break;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      less = false;
      break;
    }
  }
  return less ? new_digits - 1 | 0 : new_digits;
}
function _M0MPC28internal7strconv7Decimal11left__shift(self, s) {
  const new_digits = _M0MPC28internal7strconv7Decimal11new__digits(self, s);
  let read_index = self.digits_num;
  let write_index = self.digits_num + new_digits | 0;
  let acc = 0n;
  read_index = read_index - 1 | 0;
  while (true) {
    if (read_index >= 0) {
      const _tmp = self.digits;
      const _tmp$2 = read_index;
      const _p = _tmp$2 >>> 0 < _tmp.length ? _tmp[_tmp$2] : $oob();
      const d = BigInt.asUintN(64, BigInt(_p));
      acc = BigInt.asUintN(64, acc + BigInt.asUintN(64, d << BigInt(s & 63)));
      if (10n === 0n) {
        $panic();
      }
      const quo = BigInt.asUintN(64, BigInt.asIntN(64, acc) / BigInt.asIntN(64, 10n));
      const rem = Number(BigInt.asIntN(32, BigInt.asUintN(64, acc - BigInt.asUintN(64, quo * 10n)))) | 0;
      write_index = write_index - 1 | 0;
      if (write_index < self.digits.length) {
        const _tmp$3 = self.digits;
        const _tmp$4 = write_index;
        if (_tmp$4 >>> 0 < _tmp$3.length) {
          _tmp$3[_tmp$4] = rem & 255;
        } else {
          $oob();
        }
      } else {
        if (rem !== 0) {
          self.truncated = true;
        }
      }
      acc = quo;
      read_index = read_index - 1 | 0;
      continue;
    } else {
      break;
    }
  }
  while (true) {
    if (BigInt.asIntN(64, acc) > BigInt.asIntN(64, 0n)) {
      if (10n === 0n) {
        $panic();
      }
      const quo = BigInt.asUintN(64, BigInt.asIntN(64, acc) / BigInt.asIntN(64, 10n));
      const rem = Number(BigInt.asIntN(32, BigInt.asUintN(64, acc - BigInt.asUintN(64, 10n * quo)))) | 0;
      write_index = write_index - 1 | 0;
      if (write_index < self.digits.length) {
        const _tmp = self.digits;
        const _tmp$2 = write_index;
        if (_tmp$2 >>> 0 < _tmp.length) {
          _tmp[_tmp$2] = rem & 255;
        } else {
          $oob();
        }
      } else {
        if (rem !== 0) {
          self.truncated = true;
        }
      }
      acc = quo;
      continue;
    } else {
      break;
    }
  }
  self.digits_num = self.digits_num + new_digits | 0;
  if (self.digits_num > self.digits.length) {
    self.digits_num = self.digits.length;
  }
  self.decimal_point = self.decimal_point + new_digits | 0;
  _M0MPC28internal7strconv7Decimal4trim(self);
}
function _M0MPC28internal7strconv7Decimal12right__shift(self, s) {
  let read_index = 0;
  let write_index = 0;
  let acc = 0n;
  while (true) {
    if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63))) === BigInt.asUintN(64, 0n)) {
      if (read_index >= self.digits_num) {
        while (true) {
          if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63))) === BigInt.asUintN(64, 0n)) {
            acc = BigInt.asUintN(64, acc * 10n);
            read_index = read_index + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        break;
      }
      const _tmp = self.digits;
      const _tmp$2 = read_index;
      const d = _tmp$2 >>> 0 < _tmp.length ? _tmp[_tmp$2] : $oob();
      acc = BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + BigInt.asUintN(64, BigInt(d)));
      read_index = read_index + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  self.decimal_point = self.decimal_point - (read_index - 1 | 0) | 0;
  const mask = BigInt.asUintN(64, BigInt.asUintN(64, 1n << BigInt(s & 63)) - 1n);
  while (true) {
    if (read_index < self.digits_num) {
      const out = BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63));
      const _tmp = self.digits;
      const _tmp$2 = write_index;
      if (_tmp$2 >>> 0 < _tmp.length) {
        _tmp[_tmp$2] = (Number(BigInt.asIntN(32, out)) | 0) & 255;
      } else {
        $oob();
      }
      write_index = write_index + 1 | 0;
      acc = BigInt.asUintN(64, acc & mask);
      const _tmp$3 = self.digits;
      const _tmp$4 = read_index;
      const d = _tmp$4 >>> 0 < _tmp$3.length ? _tmp$3[_tmp$4] : $oob();
      acc = BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + BigInt.asUintN(64, BigInt(d)));
      read_index = read_index + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  while (true) {
    if (BigInt.asUintN(64, acc) > BigInt.asUintN(64, 0n)) {
      const out = BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63));
      if (write_index < self.digits.length) {
        const _tmp = self.digits;
        const _tmp$2 = write_index;
        if (_tmp$2 >>> 0 < _tmp.length) {
          _tmp[_tmp$2] = (Number(BigInt.asIntN(32, out)) | 0) & 255;
        } else {
          $oob();
        }
        write_index = write_index + 1 | 0;
      } else {
        if (BigInt.asUintN(64, out) > BigInt.asUintN(64, 0n)) {
          self.truncated = true;
        }
      }
      acc = BigInt.asUintN(64, acc & mask);
      acc = BigInt.asUintN(64, acc * 10n);
      continue;
    } else {
      break;
    }
  }
  self.digits_num = write_index;
  _M0MPC28internal7strconv7Decimal4trim(self);
}
function _M0MPC28internal7strconv7Decimal11shift__priv(self, s) {
  if (self.digits_num === 0) {
    return undefined;
  }
  let s$2 = s;
  if (s$2 > 0) {
    while (true) {
      if (s$2 > 59) {
        _M0MPC28internal7strconv7Decimal11left__shift(self, 59);
        s$2 = s$2 - 59 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0MPC28internal7strconv7Decimal11left__shift(self, s$2);
  }
  if (s$2 < 0) {
    while (true) {
      if (s$2 < -59) {
        _M0MPC28internal7strconv7Decimal12right__shift(self, 59);
        s$2 = s$2 + 59 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0MPC28internal7strconv7Decimal12right__shift(self, -s$2 | 0);
    return;
  } else {
    return;
  }
}
function _M0MPC28internal7strconv7Decimal16to__double__priv(self) {
  let exponent = 0;
  let mantissa = 0n;
  const effective_dp = self.decimal_point + self.overflowed | 0;
  if (self.digits_num === 0 || effective_dp < -330) {
    mantissa = 0n;
    exponent = _M0FPC28internal7strconv12double__info.bias;
    const bits = _M0FPC28internal7strconv14assemble__bits(mantissa, exponent, self.negative);
    return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok($i64_reinterpret_f64(bits));
  }
  if (self.decimal_point > 310) {
    const _bind = _M0FPC28internal7strconv10range__errGuE();
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _ok._0;
    } else {
      return _bind;
    }
  }
  self.decimal_point = self.decimal_point + self.overflowed | 0;
  while (true) {
    if (self.decimal_point > 0) {
      let n = 0;
      if (self.decimal_point >= _M0FPC28internal7strconv6powtab.length) {
        n = 60;
      } else {
        const _p = self.decimal_point;
        n = _p >>> 0 < _M0FPC28internal7strconv6powtab.length ? _M0FPC28internal7strconv6powtab[_p] : $oob();
      }
      _M0MPC28internal7strconv7Decimal11shift__priv(self, -n | 0);
      exponent = exponent + n | 0;
      continue;
    } else {
      break;
    }
  }
  while (true) {
    let _tmp;
    if (self.decimal_point < 0) {
      _tmp = true;
    } else {
      let _tmp$2;
      if (self.decimal_point === 0) {
        const _tmp$3 = self.digits;
        _tmp$2 = (0 >>> 0 < _tmp$3.length ? _tmp$3[0] : $oob()) < 5;
      } else {
        _tmp$2 = false;
      }
      _tmp = _tmp$2;
    }
    if (_tmp) {
      let n = 0;
      if ((-self.decimal_point | 0) >= _M0FPC28internal7strconv6powtab.length) {
        n = 60;
      } else {
        const _p = -self.decimal_point | 0;
        n = _p >>> 0 < _M0FPC28internal7strconv6powtab.length ? _M0FPC28internal7strconv6powtab[_p] : $oob();
      }
      _M0MPC28internal7strconv7Decimal11shift__priv(self, n);
      exponent = exponent - n | 0;
      continue;
    } else {
      break;
    }
  }
  exponent = exponent - 1 | 0;
  if (exponent < (_M0FPC28internal7strconv12double__info.bias + 1 | 0)) {
    const n = (_M0FPC28internal7strconv12double__info.bias + 1 | 0) - exponent | 0;
    _M0MPC28internal7strconv7Decimal11shift__priv(self, -n | 0);
    exponent = exponent + n | 0;
  }
  if ((exponent - _M0FPC28internal7strconv12double__info.bias | 0) >= ((1 << _M0FPC28internal7strconv12double__info.exponent_bits) - 1 | 0)) {
    const _bind = _M0FPC28internal7strconv10range__errGuE();
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _ok._0;
    } else {
      return _bind;
    }
  }
  _M0MPC28internal7strconv7Decimal11shift__priv(self, _M0FPC28internal7strconv12double__info.mantissa_bits + 1 | 0);
  mantissa = _M0MPC28internal7strconv7Decimal16rounded__integer(self);
  if (BigInt.asUintN(64, mantissa) === BigInt.asUintN(64, BigInt.asUintN(64, 2n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)))) {
    mantissa = BigInt.asUintN(64, BigInt.asIntN(64, mantissa) >> BigInt(1 & 63));
    exponent = exponent + 1 | 0;
    if ((exponent - _M0FPC28internal7strconv12double__info.bias | 0) >= ((1 << _M0FPC28internal7strconv12double__info.exponent_bits) - 1 | 0)) {
      const _bind = _M0FPC28internal7strconv10range__errGuE();
      if (_bind.$tag === 1) {
        const _ok = _bind;
        _ok._0;
      } else {
        return _bind;
      }
    }
  }
  if (BigInt.asUintN(64, BigInt.asUintN(64, mantissa & BigInt.asUintN(64, 1n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)))) === BigInt.asUintN(64, 0n)) {
    exponent = _M0FPC28internal7strconv12double__info.bias;
  }
  const bits = _M0FPC28internal7strconv14assemble__bits(mantissa, exponent, self.negative);
  return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok($i64_reinterpret_f64(bits));
}
function _M0FPC28internal7strconv17pow10__fast__path(exponent) {
  const _p = exponent & 31;
  return _p >>> 0 < _M0FPC28internal7strconv5table.length ? _M0FPC28internal7strconv5table[_p] : $oob();
}
function _M0MPC28internal7strconv6Number14is__fast__path(self) {
  return BigInt.asIntN(64, _M0FPC28internal7strconv25min__exponent__fast__path) <= BigInt.asIntN(64, self.exponent) && (BigInt.asIntN(64, self.exponent) <= BigInt.asIntN(64, _M0FPC28internal7strconv36max__exponent__disguised__fast__path) && (BigInt.asUintN(64, self.mantissa) <= BigInt.asUintN(64, _M0FPC28internal7strconv25max__mantissa__fast__path) && !self.many_digits));
}
function _M0MPC28internal7strconv6Number15try__fast__path(self) {
  if (_M0MPC28internal7strconv6Number14is__fast__path(self)) {
    let value;
    if (BigInt.asIntN(64, self.exponent) <= BigInt.asIntN(64, _M0FPC28internal7strconv25max__exponent__fast__path)) {
      const value$2 = $f64_convert_i64_u(BigInt.asUintN(64, self.mantissa));
      value = BigInt.asIntN(64, self.exponent) < BigInt.asIntN(64, 0n) ? value$2 / _M0FPC28internal7strconv17pow10__fast__path(-(Number(BigInt.asIntN(32, self.exponent)) | 0) | 0) : value$2 * _M0FPC28internal7strconv17pow10__fast__path(Number(BigInt.asIntN(32, self.exponent)) | 0);
    } else {
      const shift = BigInt.asUintN(64, self.exponent - _M0FPC28internal7strconv25max__exponent__fast__path);
      const _tmp = self.mantissa;
      const _p = Number(BigInt.asIntN(32, shift)) | 0;
      const _bind = _M0FPC28internal7strconv12checked__mul(_tmp, _p >>> 0 < _M0FPC28internal7strconv10int__pow10.length ? _M0FPC28internal7strconv10int__pow10[_p] : $oob());
      if (_bind === undefined) {
        return _M0DTPC16option6OptionGdE4None__;
      } else {
        const _Some = _bind;
        const _mantissa = _Some;
        if (BigInt.asUintN(64, _mantissa) > BigInt.asUintN(64, _M0FPC28internal7strconv25max__mantissa__fast__path)) {
          return _M0DTPC16option6OptionGdE4None__;
        }
        value = $f64_convert_i64_u(BigInt.asUintN(64, _mantissa)) * _M0FPC28internal7strconv17pow10__fast__path(Number(BigInt.asIntN(32, _M0FPC28internal7strconv25max__exponent__fast__path)) | 0);
      }
    }
    if (self.negative) {
      value = -value;
    }
    return new _M0DTPC16option6OptionGdE4Some(value);
  } else {
    return _M0DTPC16option6OptionGdE4None__;
  }
}
function _M0FPC28internal7strconv13parse__double(str) {
  if (!((str.end - str.start | 0) === 0)) {
    if (_M0FPC28internal7strconv17check__underscore(str)) {
      const _bind = _M0FPC28internal7strconv13parse__number(str);
      let _bind$2;
      if (_bind.$tag === 1) {
        const _ok = _bind;
        _bind$2 = _ok._0;
      } else {
        return _bind;
      }
      if (_bind$2 === undefined) {
        return _M0FPC28internal7strconv15parse__inf__nan(str);
      } else {
        const _Some = _bind$2;
        const _num = _Some;
        const _bind$3 = _M0MPC28internal7strconv6Number15try__fast__path(_num);
        if (_bind$3.$tag === 1) {
          const _Some$2 = _bind$3;
          const _value = _Some$2._0;
          return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_value);
        } else {
          const fast = _num.many_digits ? _M0FPC16double14not__a__number : _M0FPC28internal7strconv20try__eisel__lemire64(_num.mantissa, _num.exponent, _num.negative);
          if (fast !== fast) {
            const _bind$4 = _M0FPC28internal7strconv20parse__decimal__priv(str);
            let _tmp;
            if (_bind$4.$tag === 1) {
              const _ok = _bind$4;
              _tmp = _ok._0;
            } else {
              return _bind$4;
            }
            return _M0MPC28internal7strconv7Decimal16to__double__priv(_tmp);
          } else {
            return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(fast);
          }
        }
      }
    } else {
      return _M0FPC28internal7strconv11syntax__errGdE();
    }
  } else {
    return _M0FPC28internal7strconv11syntax__errGdE();
  }
}
function _M0FPC14json20offset__to__position(input, offset) {
  const _bind = _M0MPC15array9ArrayView21clamped__view_2einnerGkE(_M0MPC16string10StringView11code__units(input), 0, offset);
  const _bind$2 = _bind.end - _bind.start | 0;
  let _tmp = 0;
  let _tmp$2 = 1;
  let _tmp$3 = 0;
  while (true) {
    const _ = _tmp;
    const line = _tmp$2;
    const column = _tmp$3;
    if (_ < _bind$2) {
      const code_unit = _bind.buf[_bind.start + _ | 0];
      const _p = 10;
      if (code_unit === _p) {
        _tmp = _ + 1 | 0;
        _tmp$2 = line + 1 | 0;
        _tmp$3 = 0;
        continue;
      } else {
        _tmp = _ + 1 | 0;
        _tmp$3 = column + 1 | 0;
        continue;
      }
    } else {
      return new _M0TPC14json8Position(line, column);
    }
  }
}
function _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, shift) {
  const offset = ctx.offset + shift | 0;
  return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE3Err(new _M0DTPC15error5Error52moonbitlang_2fcore_2fjson_2eParseError_2eInvalidChar(_M0FPC14json20offset__to__position(ctx.input, offset), _M0MPC16option6Option10unwrap__orGcE(_M0MPC16string10StringView9get__char(ctx.input, offset), 65533)));
}
function _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, shift) {
  const offset = ctx.offset + shift | 0;
  return new _M0DTPC16result6ResultGuRPC14json10ParseErrorE3Err(new _M0DTPC15error5Error52moonbitlang_2fcore_2fjson_2eParseError_2eInvalidChar(_M0FPC14json20offset__to__position(ctx.input, offset), _M0MPC16option6Option10unwrap__orGcE(_M0MPC16string10StringView9get__char(ctx.input, offset), 65533)));
}
function _M0MPC14json12ParseContext21invalid__char_2einnerGiE(ctx, shift) {
  const offset = ctx.offset + shift | 0;
  return new _M0DTPC16result6ResultGiRPC14json10ParseErrorE3Err(new _M0DTPC15error5Error52moonbitlang_2fcore_2fjson_2eParseError_2eInvalidChar(_M0FPC14json20offset__to__position(ctx.input, offset), _M0MPC16option6Option10unwrap__orGcE(_M0MPC16string10StringView9get__char(ctx.input, offset), 65533)));
}
function _M0MPC14json12ParseContext21lex__skip__whitespace(ctx) {
  const end = ctx.end_offset;
  let _tmp;
  let _tmp$2 = ctx.offset;
  _L: while (true) {
    const offset = _tmp$2;
    if (offset >= end) {
      _tmp = offset;
      break;
    }
    _L$2: {
      const _bind = ctx.input;
      const _bind$2 = _bind.str.charCodeAt(_bind.start + offset | 0);
      switch (_bind$2) {
        case 32: {
          break _L$2;
        }
        case 9: {
          break _L$2;
        }
        case 13: {
          break _L$2;
        }
        case 10: {
          break _L$2;
        }
        default: {
          _tmp = offset;
          break _L;
        }
      }
    }
    _tmp$2 = offset + 1 | 0;
    continue;
  }
  ctx.offset = _tmp;
}
function _M0MPC14json12ParseContext4make(input) {
  return new _M0TPC14json12ParseContext(0, input, input.end - input.start | 0);
}
function _M0MPC14json12ParseContext19expect__ascii__char(ctx, c) {
  if (ctx.offset < ctx.end_offset) {
    const _bind = ctx.input;
    const c1 = _bind.str.charCodeAt(_bind.start + ctx.offset | 0);
    ctx.offset = ctx.offset + 1 | 0;
    return c !== c1 ? _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, -1) : new _M0DTPC16result6ResultGuRPC14json10ParseErrorE2Ok(undefined);
  } else {
    return new _M0DTPC16result6ResultGuRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  }
}
function _M0FPC14json12checked__mul(a, b) {
  if (BigInt.asUintN(64, a) === BigInt.asUintN(64, 0n) || BigInt.asUintN(64, b) === BigInt.asUintN(64, 0n)) {
    return _M0FPC14json12checked__mulN6constrS2530;
  }
  if (BigInt.asUintN(64, a) === BigInt.asUintN(64, 1n)) {
    return b;
  }
  if (BigInt.asUintN(64, b) === BigInt.asUintN(64, 1n)) {
    return a;
  }
  if ($i64_clz(b) === 0 || $i64_clz(a) === 0) {
    return undefined;
  }
  if (b === 0n) {
    $panic();
  }
  const quotient = BigInt.asUintN(64, BigInt.asUintN(64, 18446744073709551615n) / BigInt.asUintN(64, b));
  return BigInt.asUintN(64, a) > BigInt.asUintN(64, quotient) ? undefined : BigInt.asUintN(64, a * b);
}
function _M0FPC14json23json__pow10__fast__path(exponent) {
  const _p = exponent & 31;
  return _p >>> 0 < _M0FPC14json12pow10__table.length ? _M0FPC14json12pow10__table[_p] : $oob();
}
function _M0MPC14json14JsonNumberScan17try__fast__double(self) {
  if (BigInt.asUintN(64, self.mantissa) === BigInt.asUintN(64, 0n)) {
    return self.negative ? -0 : 0;
  }
  if (self.many_digits || (BigInt.asIntN(64, self.exponent) < BigInt.asIntN(64, 18446744073709551594n) || (BigInt.asIntN(64, self.exponent) > BigInt.asIntN(64, 37n) || BigInt.asUintN(64, self.mantissa) > BigInt.asUintN(64, 9007199254740992n)))) {
    return _M0FPC16double14not__a__number;
  }
  let value;
  if (BigInt.asIntN(64, self.exponent) <= BigInt.asIntN(64, 22n)) {
    const value$2 = $f64_convert_i64_u(BigInt.asUintN(64, self.mantissa));
    value = BigInt.asIntN(64, self.exponent) < BigInt.asIntN(64, 0n) ? value$2 / _M0FPC14json23json__pow10__fast__path(-(Number(BigInt.asIntN(32, self.exponent)) | 0) | 0) : value$2 * _M0FPC14json23json__pow10__fast__path(Number(BigInt.asIntN(32, self.exponent)) | 0);
  } else {
    const shift = BigInt.asUintN(64, self.exponent - 22n);
    const _tmp = self.mantissa;
    const _p = Number(BigInt.asIntN(32, shift)) | 0;
    const _bind = _M0FPC14json12checked__mul(_tmp, _p >>> 0 < _M0FPC14json17int__pow10__table.length ? _M0FPC14json17int__pow10__table[_p] : $oob());
    if (_bind === undefined) {
      return _M0FPC16double14not__a__number;
    } else {
      const _Some = _bind;
      const _mantissa = _Some;
      if (BigInt.asUintN(64, _mantissa) > BigInt.asUintN(64, 9007199254740992n)) {
        return _M0FPC16double14not__a__number;
      }
      value = $f64_convert_i64_u(BigInt.asUintN(64, _mantissa)) * _M0FPC14json23json__pow10__fast__path(22);
    }
  }
  return self.negative ? -value : value;
}
function _M0MPC14json12ParseContext17lex__integer__end(ctx, start, end) {
  const _bind = ctx.input;
  const _p = _bind.str.charCodeAt(_bind.start + start | 0);
  const _p$2 = 45;
  const negative = _p === _p$2;
  const number_start = negative ? start + 1 | 0 : start;
  let _tmp = number_start;
  let _tmp$2 = 0n;
  while (true) {
    const i = _tmp;
    const acc = _tmp$2;
    if (i >= end) {
      const value = negative ? BigInt.asUintN(64, -acc) : acc;
      const _bind$2 = $f64_convert_i64(BigInt.asIntN(64, value));
      const _bind$3 = undefined;
      return new _M0TPC14json11LexedNumber(_bind$3, _bind$2);
    }
    const _bind$2 = ctx.input;
    const digit = BigInt.asUintN(64, BigInt(_bind$2.str.charCodeAt(_bind$2.start + i | 0) - 48 | 0));
    if (10n === 0n) {
      $panic();
    }
    if (BigInt.asIntN(64, acc) > BigInt.asIntN(64, BigInt.asUintN(64, BigInt.asIntN(64, BigInt.asUintN(64, 9007199254740991n - digit)) / BigInt.asIntN(64, 10n)))) {
      const s = _M0MPC16string10StringView12view_2einner(ctx.input, start, end);
      let _try_err;
      _L: {
        const _bind$3 = _M0FPC28internal7strconv13parse__double(s);
        let value;
        if (_bind$3.$tag === 1) {
          const _ok = _bind$3;
          value = _ok._0;
        } else {
          const _err = _bind$3;
          _try_err = _err._0;
          break _L;
        }
        const _bind$4 = s;
        return new _M0TPC14json11LexedNumber(_bind$4, value);
      }
      let _tmp$3;
      if (negative) {
        const _bind$3 = s;
        _tmp$3 = new _M0TPC14json11LexedNumber(_bind$3, _M0FPC16double13neg__infinity);
      } else {
        const _bind$3 = s;
        _tmp$3 = new _M0TPC14json11LexedNumber(_bind$3, _M0FPC16double8infinity);
      }
      return _tmp$3;
    }
    _tmp = i + 1 | 0;
    _tmp$2 = BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + digit);
    continue;
  }
}
function _M0MPC14json12ParseContext18scan__json__number(ctx, start, end) {
  const _bind = ctx.input;
  const _p = _bind.str.charCodeAt(_bind.start + start | 0);
  const _p$2 = 45;
  const negative = _p === _p$2;
  let has_decimal = false;
  let has_exponent = false;
  let exponent_negative = false;
  let exponent_part = 0n;
  let fractional_digits = 0;
  let mantissa = 0n;
  let significant_digits = 0;
  let seen_nonzero = false;
  const _bind$2 = negative ? start + 1 | 0 : start;
  let _tmp = _bind$2;
  while (true) {
    const i = _tmp;
    if (i < end) {
      _L: {
        _L$2: {
          const _bind$3 = ctx.input;
          const _bind$4 = _bind$3.str.charCodeAt(_bind$3.start + i | 0);
          if (_bind$4 >= 48 && _bind$4 <= 57) {
            const digit = _bind$4 - 48 | 0;
            if (has_exponent) {
              if (BigInt.asIntN(64, exponent_part) < BigInt.asIntN(64, 100000n)) {
                const next_exponent = BigInt.asUintN(64, BigInt.asUintN(64, exponent_part * 10n) + BigInt.asUintN(64, BigInt(digit)));
                exponent_part = BigInt.asIntN(64, next_exponent) > BigInt.asIntN(64, 100000n) ? 100000n : next_exponent;
              }
            } else {
              if (has_decimal) {
                fractional_digits = fractional_digits + 1 | 0;
              }
              if (digit !== 0 || seen_nonzero) {
                seen_nonzero = true;
                significant_digits = significant_digits + 1 | 0;
                if (significant_digits <= 19) {
                  mantissa = BigInt.asUintN(64, BigInt.asUintN(64, mantissa * 10n) + BigInt.asUintN(64, BigInt(digit >>> 0)));
                }
              }
            }
          } else {
            if (_bind$4 === 46) {
              has_decimal = true;
            } else {
              if (_bind$4 === 101) {
                break _L$2;
              } else {
                if (_bind$4 === 69) {
                  break _L$2;
                }
              }
            }
          }
          break _L;
        }
        has_exponent = true;
        if ((i + 1 | 0) < end) {
          const _bind$3 = ctx.input;
          const next = _bind$3.str.charCodeAt(_bind$3.start + (i + 1 | 0) | 0);
          const _p$3 = 45;
          if (next === _p$3) {
            exponent_negative = true;
          }
        }
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const exponent_part$2 = exponent_negative ? BigInt.asUintN(64, -exponent_part) : exponent_part;
  return new _M0TPC14json14JsonNumberScan(negative, !has_decimal && !has_exponent, mantissa, BigInt.asUintN(64, exponent_part$2 - BigInt.asUintN(64, BigInt(fractional_digits))), significant_digits > 19);
}
function _M0MPC14json12ParseContext16lex__number__end(ctx, start, end) {
  const scan = _M0MPC14json12ParseContext18scan__json__number(ctx, start, end);
  if (scan.is_integer) {
    if (!scan.many_digits && (BigInt.asUintN(64, scan.exponent) === BigInt.asUintN(64, 0n) && BigInt.asUintN(64, scan.mantissa) <= BigInt.asUintN(64, 9007199254740991n))) {
      const v = $f64_convert_i64(BigInt.asIntN(64, scan.mantissa));
      const value = scan.negative ? -v : v;
      const _bind = undefined;
      return new _M0TPC14json11LexedNumber(_bind, value);
    }
    return _M0MPC14json12ParseContext17lex__integer__end(ctx, start, end);
  }
  const fast = _M0MPC14json14JsonNumberScan17try__fast__double(scan);
  if (!(fast !== fast)) {
    const _bind = undefined;
    return new _M0TPC14json11LexedNumber(_bind, fast);
  }
  if (!scan.many_digits) {
    const fast$2 = _M0FPC28internal7strconv20try__eisel__lemire64(scan.mantissa, scan.exponent, scan.negative);
    if (!(fast$2 !== fast$2)) {
      const _bind = undefined;
      return new _M0TPC14json11LexedNumber(_bind, fast$2);
    }
  }
  const s = _M0MPC16string10StringView12view_2einner(ctx.input, start, end);
  let _try_err;
  _L: {
    const _bind = _M0FPC28internal7strconv13parse__double(s);
    let d;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      d = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    const _bind$2 = undefined;
    return new _M0TPC14json11LexedNumber(_bind$2, d);
  }
  if (scan.negative) {
    const _bind = s;
    return new _M0TPC14json11LexedNumber(_bind, _M0FPC16double13neg__infinity);
  } else {
    const _bind = s;
    return new _M0TPC14json11LexedNumber(_bind, _M0FPC16double8infinity);
  }
}
function _M0MPC14json12ParseContext10read__char(ctx) {
  if (ctx.offset < ctx.end_offset) {
    const _bind = ctx.input;
    const c1 = _bind.str.charCodeAt(_bind.start + ctx.offset | 0);
    ctx.offset = ctx.offset + 1 | 0;
    if (c1 >= 55296 && c1 <= 56319) {
      if (ctx.offset < ctx.end_offset) {
        const _bind$2 = ctx.input;
        const c2 = _bind$2.str.charCodeAt(_bind$2.start + ctx.offset | 0);
        if (c2 >= 56320 && c2 <= 57343) {
          ctx.offset = ctx.offset + 1 | 0;
          const c3 = ((c1 << 10) + c2 | 0) - 56613888 | 0;
          return c3;
        }
      }
    }
    return c1;
  } else {
    return -1;
  }
}
function _M0MPC14json12ParseContext31lex__decimal__exponent__integer(ctx, start) {
  while (true) {
    const _bind = _M0MPC14json12ParseContext10read__char(ctx);
    if (_bind === -1) {
      return _M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset);
    } else {
      const _Some = _bind;
      const _x = _Some;
      if (_x >= 48 && _x <= 57) {
        continue;
      } else {
        ctx.offset = ctx.offset - 1 | 0;
        return _M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset);
      }
    }
  }
}
function _M0MPC14json12ParseContext28lex__decimal__exponent__sign(ctx, start) {
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    if (_x >= 48 && _x <= 57) {
      return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext31lex__decimal__exponent__integer(ctx, start));
    } else {
      ctx.offset = ctx.offset - 1 | 0;
      return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, 0);
    }
  }
}
function _M0MPC14json12ParseContext22lex__decimal__exponent(ctx, start) {
  _L: {
    const _bind = _M0MPC14json12ParseContext10read__char(ctx);
    if (_bind === -1) {
      return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
    } else {
      const _Some = _bind;
      const _x = _Some;
      if (_x === 43) {
        break _L;
      } else {
        if (_x === 45) {
          break _L;
        } else {
          if (_x >= 48 && _x <= 57) {
            return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext31lex__decimal__exponent__integer(ctx, start));
          } else {
            ctx.offset = ctx.offset - 1 | 0;
            return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, 0);
          }
        }
      }
    }
  }
  const _bind = _M0MPC14json12ParseContext28lex__decimal__exponent__sign(ctx, start);
  let _tmp;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp = _ok._0;
  } else {
    return _bind;
  }
  return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_tmp);
}
function _M0MPC14json12ParseContext22lex__decimal__fraction(ctx, start) {
  while (true) {
    _L: {
      const _bind = _M0MPC14json12ParseContext10read__char(ctx);
      if (_bind === -1) {
        return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset));
      } else {
        const _Some = _bind;
        const _x = _Some;
        if (_x === 101) {
          break _L;
        } else {
          if (_x === 69) {
            break _L;
          } else {
            if (_x >= 48 && _x <= 57) {
              continue;
            } else {
              ctx.offset = ctx.offset - 1 | 0;
              return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset));
            }
          }
        }
      }
    }
    const _bind = _M0MPC14json12ParseContext22lex__decimal__exponent(ctx, start);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      return _bind;
    }
    return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_tmp);
  }
}
function _M0MPC14json12ParseContext19lex__decimal__point(ctx, start) {
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    return _x >= 48 && _x <= 57 ? _M0MPC14json12ParseContext22lex__decimal__fraction(ctx, start) : _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
  }
}
function _M0MPC14json12ParseContext21lex__decimal__integer(ctx, start) {
  while (true) {
    _L: {
      const _bind = _M0MPC14json12ParseContext10read__char(ctx);
      if (_bind === -1) {
        return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset));
      } else {
        const _Some = _bind;
        const _x = _Some;
        if (_x === 46) {
          const _bind$2 = _M0MPC14json12ParseContext19lex__decimal__point(ctx, start);
          let _tmp;
          if (_bind$2.$tag === 1) {
            const _ok = _bind$2;
            _tmp = _ok._0;
          } else {
            return _bind$2;
          }
          return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_tmp);
        } else {
          if (_x === 101) {
            break _L;
          } else {
            if (_x === 69) {
              break _L;
            } else {
              if (_x >= 48 && _x <= 57) {
                continue;
              } else {
                ctx.offset = ctx.offset - 1 | 0;
                return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset));
              }
            }
          }
        }
      }
    }
    const _bind = _M0MPC14json12ParseContext22lex__decimal__exponent(ctx, start);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      return _bind;
    }
    return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_tmp);
  }
}
function _M0MPC14json12ParseContext16lex__hex__digits(ctx, n) {
  let _tmp;
  let _tmp$2 = 0;
  let _tmp$3 = 0;
  while (true) {
    const _ = _tmp$2;
    const r = _tmp$3;
    if (_ < n) {
      const _bind = _M0MPC14json12ParseContext10read__char(ctx);
      let d;
      if (_bind === -1) {
        return new _M0DTPC16result6ResultGiRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
      } else {
        const _Some = _bind;
        const _x = _Some;
        if (_x >= 48 && _x <= 57) {
          d = _x - 48 | 0;
        } else {
          if (_x >= 65 && _x <= 70) {
            d = (_x - 65 | 0) + 10 | 0;
          } else {
            if (_x >= 97 && _x <= 102) {
              d = (_x - 97 | 0) + 10 | 0;
            } else {
              const _p = _x;
              const _bind$2 = _M0MPC14json12ParseContext21invalid__char_2einnerGiE(ctx, -(_p <= 65535 ? 1 : 2) | 0);
              if (_bind$2.$tag === 1) {
                const _ok = _bind$2;
                d = _ok._0;
              } else {
                return _bind$2;
              }
            }
          }
        }
      }
      _tmp$2 = _ + 1 | 0;
      _tmp$3 = r << 4 | d;
      continue;
    } else {
      _tmp = r;
      break;
    }
  }
  return new _M0DTPC16result6ResultGiRPC14json10ParseErrorE2Ok(_tmp);
}
function _M0MPC14json12ParseContext19unpaired__surrogateGuE(ctx, escape_start) {
  return _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, escape_start - ctx.offset | 0);
}
function _M0MPC14json12ParseContext17lex__string__slow(ctx, run_start) {
  const buf = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  let start = run_start;
  const end = ctx.end_offset;
  let _tmp = ctx.offset;
  while (true) {
    const i = _tmp;
    if (i < end) {
      const _bind = ctx.input;
      const c = _bind.str.charCodeAt(_bind.start + i | 0);
      const _p = 34;
      if (c === _p) {
        ctx.offset = i + 1 | 0;
        if (start > 0 && i > start) {
          _M0IPB13StringBuilderPB6Logger11write__view(buf, _M0MPC16string10StringView21clamped__view_2einner(ctx.input, start, i));
        }
        break;
      } else {
        const _p$2 = 92;
        if (c === _p$2) {
          ctx.offset = i + 1 | 0;
          if (start > 0 && i > start) {
            _M0IPB13StringBuilderPB6Logger11write__view(buf, _M0MPC16string10StringView21clamped__view_2einner(ctx.input, start, i));
          }
          const _bind$2 = _M0MPC14json12ParseContext10read__char(ctx);
          if (_bind$2 === -1) {
            return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
          } else {
            const _Some = _bind$2;
            const _x = _Some;
            switch (_x) {
              case 98: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 8);
                break;
              }
              case 102: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 12);
                break;
              }
              case 110: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 10);
                break;
              }
              case 114: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 13);
                break;
              }
              case 116: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 9);
                break;
              }
              case 34: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
                break;
              }
              case 92: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 92);
                break;
              }
              case 47: {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 47);
                break;
              }
              case 117: {
                const escape_start = ctx.offset - 2 | 0;
                const _bind$3 = _M0MPC14json12ParseContext16lex__hex__digits(ctx, 4);
                let c$2;
                if (_bind$3.$tag === 1) {
                  const _ok = _bind$3;
                  c$2 = _ok._0;
                } else {
                  return _bind$3;
                }
                if (c$2 >= 55296 && c$2 <= 56319) {
                  const _bind$4 = _M0MPC14json12ParseContext10read__char(ctx);
                  if (_bind$4 === -1) {
                    return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
                  } else {
                    const _Some$2 = _bind$4;
                    const _x$2 = _Some$2;
                    if (_x$2 === 92) {
                    } else {
                      const _bind$5 = _M0MPC14json12ParseContext19unpaired__surrogateGuE(ctx, escape_start);
                      if (_bind$5.$tag === 1) {
                        const _ok = _bind$5;
                        _ok._0;
                      } else {
                        return _bind$5;
                      }
                    }
                  }
                  const _bind$5 = _M0MPC14json12ParseContext10read__char(ctx);
                  if (_bind$5 === -1) {
                    return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
                  } else {
                    const _Some$2 = _bind$5;
                    const _x$2 = _Some$2;
                    if (_x$2 === 117) {
                    } else {
                      const _bind$6 = _M0MPC14json12ParseContext19unpaired__surrogateGuE(ctx, escape_start);
                      if (_bind$6.$tag === 1) {
                        const _ok = _bind$6;
                        _ok._0;
                      } else {
                        return _bind$6;
                      }
                    }
                  }
                  const _bind$6 = _M0MPC14json12ParseContext16lex__hex__digits(ctx, 4);
                  let c2;
                  if (_bind$6.$tag === 1) {
                    const _ok = _bind$6;
                    c2 = _ok._0;
                  } else {
                    return _bind$6;
                  }
                  if (c2 >= 56320 && c2 <= 57343) {
                    const combined = ((c$2 << 10) + c2 | 0) - 56613888 | 0;
                    _M0IPB13StringBuilderPB6Logger11write__char(buf, combined);
                  } else {
                    const _bind$7 = _M0MPC14json12ParseContext19unpaired__surrogateGuE(ctx, escape_start);
                    if (_bind$7.$tag === 1) {
                      const _ok = _bind$7;
                      _ok._0;
                    } else {
                      return _bind$7;
                    }
                  }
                } else {
                  if (c$2 >= 56320 && c$2 <= 57343) {
                    const _bind$4 = _M0MPC14json12ParseContext19unpaired__surrogateGuE(ctx, escape_start);
                    if (_bind$4.$tag === 1) {
                      const _ok = _bind$4;
                      _ok._0;
                    } else {
                      return _bind$4;
                    }
                  } else {
                    _M0IPB13StringBuilderPB6Logger11write__char(buf, c$2);
                  }
                }
                break;
              }
              default: {
                const _p$3 = _x;
                const _bind$4 = _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, -(_p$3 <= 65535 ? 1 : 2) | 0);
                if (_bind$4.$tag === 1) {
                  const _ok = _bind$4;
                  _ok._0;
                } else {
                  return _bind$4;
                }
              }
            }
          }
          start = ctx.offset;
          _tmp = ctx.offset;
          continue;
        } else {
          if (c < 32) {
            ctx.offset = i + 1 | 0;
            const _bind$2 = _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, -1);
            if (_bind$2.$tag === 1) {
              const _ok = _bind$2;
              _ok._0;
            } else {
              return _bind$2;
            }
          } else {
            _tmp = i + 1 | 0;
            continue;
          }
        }
      }
    } else {
      return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
    }
    continue;
  }
  return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE2Ok(buf.val);
}
function _M0MPC14json12ParseContext11lex__string(ctx) {
  const string_start = ctx.offset;
  const end = ctx.end_offset;
  let _tmp = string_start;
  while (true) {
    const i = _tmp;
    if (i < end) {
      const _bind = ctx.input;
      const c = _bind.str.charCodeAt(_bind.start + i | 0);
      const _p = 34;
      if (c === _p) {
        ctx.offset = i + 1 | 0;
        const _p$2 = ctx.input;
        const base = _p$2.start;
        const _p$3 = ctx.input;
        return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE2Ok(_p$3.str.substring(base + string_start | 0, base + i | 0));
      } else {
        const _p$2 = 92;
        if (c === _p$2) {
          ctx.offset = i;
          const _bind$2 = _M0MPC14json12ParseContext17lex__string__slow(ctx, string_start);
          let _tmp$2;
          if (_bind$2.$tag === 1) {
            const _ok = _bind$2;
            _tmp$2 = _ok._0;
          } else {
            return _bind$2;
          }
          return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE2Ok(_tmp$2);
        } else {
          if (c < 32) {
            ctx.offset = i + 1 | 0;
            const _bind$2 = _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, -1);
            if (_bind$2.$tag === 1) {
              const _ok = _bind$2;
              _ok._0;
            } else {
              return _bind$2;
            }
          }
        }
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGsRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
}
function _M0MPC14json12ParseContext9lex__zero(ctx, start) {
  _L: {
    const _bind = _M0MPC14json12ParseContext10read__char(ctx);
    if (_bind === -1) {
      return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset));
    } else {
      const _Some = _bind;
      const _x = _Some;
      if (_x === 46) {
        return _M0MPC14json12ParseContext19lex__decimal__point(ctx, start);
      } else {
        if (_x === 101) {
          break _L;
        } else {
          if (_x === 69) {
            break _L;
          } else {
            if (_x >= 48 && _x <= 57) {
              ctx.offset = ctx.offset - 1 | 0;
              return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, 0);
            } else {
              ctx.offset = ctx.offset - 1 | 0;
              return new _M0DTPC16result6ResultGRPC14json11LexedNumberRPC14json10ParseErrorE2Ok(_M0MPC14json12ParseContext16lex__number__end(ctx, start, ctx.offset));
            }
          }
        }
      }
    }
  }
  return _M0MPC14json12ParseContext22lex__decimal__exponent(ctx, start);
}
function _M0MPC14json12ParseContext10lex__value(ctx, allow_rbracket) {
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    if (_x === 123) {
      return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token6LBrace__);
    } else {
      if (_x === 91) {
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token8LBracket__);
      } else {
        if (_x === 93) {
          if (allow_rbracket) {
            return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token8RBracket__);
          } else {
            return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
          }
        } else {
          if (_x === 110) {
            const _bind$2 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 117);
            if (_bind$2.$tag === 1) {
              const _ok = _bind$2;
              _ok._0;
            } else {
              return _bind$2;
            }
            const _bind$3 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 108);
            if (_bind$3.$tag === 1) {
              const _ok = _bind$3;
              _ok._0;
            } else {
              return _bind$3;
            }
            const _bind$4 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 108);
            if (_bind$4.$tag === 1) {
              const _ok = _bind$4;
              _ok._0;
            } else {
              return _bind$4;
            }
            return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token4Null__);
          } else {
            if (_x === 116) {
              const _bind$2 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 114);
              if (_bind$2.$tag === 1) {
                const _ok = _bind$2;
                _ok._0;
              } else {
                return _bind$2;
              }
              const _bind$3 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 117);
              if (_bind$3.$tag === 1) {
                const _ok = _bind$3;
                _ok._0;
              } else {
                return _bind$3;
              }
              const _bind$4 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 101);
              if (_bind$4.$tag === 1) {
                const _ok = _bind$4;
                _ok._0;
              } else {
                return _bind$4;
              }
              return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token4True__);
            } else {
              if (_x === 102) {
                const _bind$2 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 97);
                if (_bind$2.$tag === 1) {
                  const _ok = _bind$2;
                  _ok._0;
                } else {
                  return _bind$2;
                }
                const _bind$3 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 108);
                if (_bind$3.$tag === 1) {
                  const _ok = _bind$3;
                  _ok._0;
                } else {
                  return _bind$3;
                }
                const _bind$4 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 115);
                if (_bind$4.$tag === 1) {
                  const _ok = _bind$4;
                  _ok._0;
                } else {
                  return _bind$4;
                }
                const _bind$5 = _M0MPC14json12ParseContext19expect__ascii__char(ctx, 101);
                if (_bind$5.$tag === 1) {
                  const _ok = _bind$5;
                  _ok._0;
                } else {
                  return _bind$5;
                }
                return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token5False__);
              } else {
                if (_x === 45) {
                  const _bind$2 = _M0MPC14json12ParseContext10read__char(ctx);
                  if (_bind$2 === -1) {
                    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
                  } else {
                    const _Some$2 = _bind$2;
                    const _x$2 = _Some$2;
                    if (_x$2 === 48) {
                      const _bind$3 = _M0MPC14json12ParseContext9lex__zero(ctx, ctx.offset - 2 | 0);
                      let _bind$4;
                      if (_bind$3.$tag === 1) {
                        const _ok = _bind$3;
                        _bind$4 = _ok._0;
                      } else {
                        return _bind$3;
                      }
                      const _n = _bind$4.value;
                      const _repr = _bind$4.repr;
                      return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6Number(_n, _M0MPC16option6Option3mapGRPC16string10StringViewsE(_repr, (repr) => _M0MPC16string10StringView9to__owned(repr))));
                    } else {
                      if (_x$2 >= 49 && _x$2 <= 57) {
                        const _bind$3 = _M0MPC14json12ParseContext21lex__decimal__integer(ctx, ctx.offset - 2 | 0);
                        let _bind$4;
                        if (_bind$3.$tag === 1) {
                          const _ok = _bind$3;
                          _bind$4 = _ok._0;
                        } else {
                          return _bind$3;
                        }
                        const _n = _bind$4.value;
                        const _repr = _bind$4.repr;
                        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6Number(_n, _M0MPC16option6Option3mapGRPC16string10StringViewsE(_repr, (repr) => _M0MPC16string10StringView9to__owned(repr))));
                      } else {
                        return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
                      }
                    }
                  }
                } else {
                  if (_x === 48) {
                    const _bind$2 = _M0MPC14json12ParseContext9lex__zero(ctx, ctx.offset - 1 | 0);
                    let _bind$3;
                    if (_bind$2.$tag === 1) {
                      const _ok = _bind$2;
                      _bind$3 = _ok._0;
                    } else {
                      return _bind$2;
                    }
                    const _n = _bind$3.value;
                    const _repr = _bind$3.repr;
                    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6Number(_n, _M0MPC16option6Option3mapGRPC16string10StringViewsE(_repr, (repr) => _M0MPC16string10StringView9to__owned(repr))));
                  } else {
                    if (_x >= 49 && _x <= 57) {
                      const _bind$2 = _M0MPC14json12ParseContext21lex__decimal__integer(ctx, ctx.offset - 1 | 0);
                      let _bind$3;
                      if (_bind$2.$tag === 1) {
                        const _ok = _bind$2;
                        _bind$3 = _ok._0;
                      } else {
                        return _bind$2;
                      }
                      const _n = _bind$3.value;
                      const _repr = _bind$3.repr;
                      return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6Number(_n, _M0MPC16option6Option3mapGRPC16string10StringViewsE(_repr, (repr) => _M0MPC16string10StringView9to__owned(repr))));
                    } else {
                      if (_x === 34) {
                        const _bind$2 = _M0MPC14json12ParseContext11lex__string(ctx);
                        let s;
                        if (_bind$2.$tag === 1) {
                          const _ok = _bind$2;
                          s = _ok._0;
                        } else {
                          return _bind$2;
                        }
                        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6String(s));
                      } else {
                        const _p = _x;
                        const shift = -(_p <= 65535 ? 1 : 2) | 0;
                        return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, shift);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
function _M0MPC14json12ParseContext24lex__after__array__value(ctx) {
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    switch (_x) {
      case 93: {
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token8RBracket__);
      }
      case 44: {
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token5Comma__);
      }
      default: {
        return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
      }
    }
  }
}
function _M0MPC14json12ParseContext25lex__after__object__value(ctx) {
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    switch (_x) {
      case 125: {
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token6RBrace__);
      }
      case 44: {
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token5Comma__);
      }
      default: {
        return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
      }
    }
  }
}
function _M0MPC14json12ParseContext26lex__after__property__name(ctx) {
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGuRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    if (_x === 58) {
      return new _M0DTPC16result6ResultGuRPC14json10ParseErrorE2Ok(undefined);
    } else {
      return _M0MPC14json12ParseContext21invalid__char_2einnerGuE(ctx, -1);
    }
  }
}
function _M0MPC14json12ParseContext19lex__property__name(ctx) {
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    switch (_x) {
      case 125: {
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(_M0DTPC14json5Token6RBrace__);
      }
      case 34: {
        const _bind$2 = _M0MPC14json12ParseContext11lex__string(ctx);
        let s;
        if (_bind$2.$tag === 1) {
          const _ok = _bind$2;
          s = _ok._0;
        } else {
          return _bind$2;
        }
        return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6String(s));
      }
      default: {
        return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
      }
    }
  }
}
function _M0MPC14json12ParseContext20lex__property__name2(ctx) {
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  const _bind = _M0MPC14json12ParseContext10read__char(ctx);
  if (_bind === -1) {
    return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE3Err(_M0DTPC15error5Error51moonbitlang_2fcore_2fjson_2eParseError_2eInvalidEof__);
  } else {
    const _Some = _bind;
    const _x = _Some;
    if (_x === 34) {
      const _bind$2 = _M0MPC14json12ParseContext11lex__string(ctx);
      let s;
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        s = _ok._0;
      } else {
        return _bind$2;
      }
      return new _M0DTPC16result6ResultGRPC14json5TokenRPC14json10ParseErrorE2Ok(new _M0DTPC14json5Token6String(s));
    } else {
      return _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, -1);
    }
  }
}
function _M0MPC14json12ParseContext12parse__value(ctx, remaining_available_depth) {
  const _bind = _M0MPC14json12ParseContext10lex__value(ctx, false);
  let tok;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    tok = _ok._0;
  } else {
    return _bind;
  }
  return _M0MPC14json12ParseContext13parse__value2(ctx, tok, remaining_available_depth);
}
function _M0MPC14json12ParseContext13parse__value2(ctx, tok, remaining_available_depth) {
  _L: {
    switch (tok.$tag) {
      case 0: {
        return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(_M0FPB4null);
      }
      case 1: {
        const _p = true;
        return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(_p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__);
      }
      case 2: {
        const _p$2 = false;
        return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(_p$2 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__);
      }
      case 3: {
        const _Number = tok;
        const _n = _Number._0;
        const _repr = _Number._1;
        return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(new _M0DTPB4Json6Number(_n, _repr));
      }
      case 4: {
        const _String = tok;
        const _s = _String._0;
        return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(new _M0DTPB4Json6String(_s));
      }
      case 5: {
        return _M0MPC14json12ParseContext13parse__object(ctx, remaining_available_depth);
      }
      case 7: {
        return _M0MPC14json12ParseContext12parse__array(ctx, remaining_available_depth);
      }
      case 8: {
        break _L;
      }
      case 6: {
        break _L;
      }
      default: {
        break _L;
      }
    }
  }
  return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok($panic());
}
function _M0MPC14json12ParseContext12parse__array(ctx, remaining_available_depth) {
  if (remaining_available_depth <= 0) {
    return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE3Err(_M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eDepthLimitExceeded__);
  }
  const child_remaining_available_depth = remaining_available_depth - 1 | 0;
  const vec = [];
  let _tmp;
  const _bind = _M0MPC14json12ParseContext10lex__value(ctx, true);
  let _tmp$2;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp$2 = _ok._0;
  } else {
    return _bind;
  }
  let _tmp$3 = _tmp$2;
  _L: while (true) {
    const x = _tmp$3;
    if (x.$tag === 8) {
      _tmp = new _M0DTPB4Json5Array(vec);
      break;
    } else {
      const _bind$2 = _M0MPC14json12ParseContext13parse__value2(ctx, x, child_remaining_available_depth);
      let _tmp$4;
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        _tmp$4 = _ok._0;
      } else {
        return _bind$2;
      }
      _M0MPC15array5Array4pushGsE(vec, _tmp$4);
      const _bind$3 = _M0MPC14json12ParseContext24lex__after__array__value(ctx);
      let tok2;
      if (_bind$3.$tag === 1) {
        const _ok = _bind$3;
        tok2 = _ok._0;
      } else {
        return _bind$3;
      }
      switch (tok2.$tag) {
        case 9: {
          const _bind$4 = _M0MPC14json12ParseContext10lex__value(ctx, false);
          if (_bind$4.$tag === 1) {
            const _ok = _bind$4;
            _tmp$3 = _ok._0;
          } else {
            return _bind$4;
          }
          continue _L;
        }
        case 8: {
          _tmp = new _M0DTPB4Json5Array(vec);
          break _L;
        }
        default: {
          $panic();
        }
      }
    }
    continue;
  }
  return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(_tmp);
}
function _M0MPC14json12ParseContext13parse__object(ctx, remaining_available_depth) {
  if (remaining_available_depth <= 0) {
    return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE3Err(_M0DTPC15error5Error59moonbitlang_2fcore_2fjson_2eParseError_2eDepthLimitExceeded__);
  }
  const child_remaining_available_depth = remaining_available_depth - 1 | 0;
  const _bind = [];
  const map = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 0), undefined);
  let _tmp;
  const _bind$2 = _M0MPC14json12ParseContext19lex__property__name(ctx);
  let _tmp$2;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    _tmp$2 = _ok._0;
  } else {
    return _bind$2;
  }
  let _tmp$3 = _tmp$2;
  _L: while (true) {
    const x = _tmp$3;
    switch (x.$tag) {
      case 6: {
        _tmp = new _M0DTPB4Json6Object(map);
        break _L;
      }
      case 4: {
        const _String = x;
        const _name = _String._0;
        const _bind$3 = _M0MPC14json12ParseContext26lex__after__property__name(ctx);
        if (_bind$3.$tag === 1) {
          const _ok = _bind$3;
          _ok._0;
        } else {
          return _bind$3;
        }
        const _bind$4 = _M0MPC14json12ParseContext12parse__value(ctx, child_remaining_available_depth);
        let _tmp$4;
        if (_bind$4.$tag === 1) {
          const _ok = _bind$4;
          _tmp$4 = _ok._0;
        } else {
          return _bind$4;
        }
        _M0MPB3Map3setGsRPB4JsonE(map, _name, _tmp$4);
        const _bind$5 = _M0MPC14json12ParseContext25lex__after__object__value(ctx);
        let _bind$6;
        if (_bind$5.$tag === 1) {
          const _ok = _bind$5;
          _bind$6 = _ok._0;
        } else {
          return _bind$5;
        }
        switch (_bind$6.$tag) {
          case 9: {
            const _bind$7 = _M0MPC14json12ParseContext20lex__property__name2(ctx);
            if (_bind$7.$tag === 1) {
              const _ok = _bind$7;
              _tmp$3 = _ok._0;
            } else {
              return _bind$7;
            }
            continue _L;
          }
          case 6: {
            _tmp = new _M0DTPB4Json6Object(map);
            break _L;
          }
          default: {
            $panic();
          }
        }
        break;
      }
      default: {
        $panic();
      }
    }
    continue;
  }
  return new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(_tmp);
}
function _M0FPC14json13parse_2einner(input, max_nesting_depth) {
  const ctx = _M0MPC14json12ParseContext4make(input);
  const _bind = _M0MPC14json12ParseContext12parse__value(ctx, max_nesting_depth);
  let val;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    val = _ok._0;
  } else {
    return _bind;
  }
  _M0MPC14json12ParseContext21lex__skip__whitespace(ctx);
  return ctx.offset >= ctx.end_offset ? new _M0DTPC16result6ResultGRPB4JsonRPC14json10ParseErrorE2Ok(val) : _M0MPC14json12ParseContext21invalid__char_2einnerGRPB4JsonE(ctx, 0);
}
function _M0FPC14json19needs__escape__unit(code, escape_slash) {
  const _p = 34;
  if (code === _p) {
    return true;
  } else {
    let _tmp;
    const _p$2 = 92;
    if (code === _p$2) {
      _tmp = true;
    } else {
      let _tmp$2;
      if (code < 32) {
        _tmp$2 = true;
      } else {
        let _tmp$3;
        if (escape_slash) {
          const _p$3 = 47;
          _tmp$3 = code === _p$3;
        } else {
          _tmp$3 = false;
        }
        _tmp$2 = _tmp$3;
      }
      _tmp = _tmp$2;
    }
    return _tmp;
  }
}
function _M0FPC14json20need__escape__scalar(str, escape_slash, start, end) {
  let _tmp = start;
  while (true) {
    const i = _tmp;
    if (i < end) {
      if (_M0FPC14json19needs__escape__unit(str.charCodeAt(i), escape_slash)) {
        return true;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return false;
}
function _M0FPC14json12need__escape(str, escape_slash) {
  return _M0FPC14json20need__escape__scalar(str, escape_slash, 0, str.length);
}
function _M0FPC14json13write__escape(buf, code) {
  switch (code) {
    case 34: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\\"");
      return;
    }
    case 92: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\\\");
      return;
    }
    case 47: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\/");
      return;
    }
    case 10: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\n");
      return;
    }
    case 13: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\r");
      return;
    }
    case 8: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\b");
      return;
    }
    case 9: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\t");
      return;
    }
    case 12: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\f");
      return;
    }
    default: {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\u00");
      _M0IPB13StringBuilderPB6Logger13write__string(buf, _M0MPC14byte4Byte7to__hex(code & 255));
      return;
    }
  }
}
function _M0FPC14json14write__escaped(buf, str, escape_slash) {
  if (!_M0FPC14json12need__escape(str, escape_slash)) {
    _M0IPB13StringBuilderPB6Logger13write__string(buf, str);
    return undefined;
  }
  const _bind = str.length;
  let _tmp = 0;
  let _tmp$2 = 0;
  while (true) {
    const i = _tmp;
    const run_start = _tmp$2;
    if (i < _bind) {
      const code = str.charCodeAt(i);
      if (_M0FPC14json19needs__escape__unit(code, escape_slash)) {
        _M0IPB13StringBuilderPB6Logger11write__view(buf, _M0MPC16string6String19exact__view_2einner(str, run_start, i));
        _M0FPC14json13write__escape(buf, code);
        _tmp = i + 1 | 0;
        _tmp$2 = i + 1 | 0;
        continue;
      } else {
        _tmp = i + 1 | 0;
        continue;
      }
    } else {
      _M0IPB13StringBuilderPB6Logger11write__view(buf, _M0MPC16string6String19exact__view_2einner(str, run_start, undefined));
      return;
    }
  }
}
function _M0FPC14json13write__indent(buf, cache, level, indent) {
  while (true) {
    if (cache.length <= level) {
      if (cache.length >= 1) {
        const _last = cache[cache.length - 1 | 0];
        _M0MPC15array5Array4pushGsE(cache, `${_last}${_M0MPC16string6String6repeat(" ", indent)}`);
      } else {
        _M0MPC15array5Array4pushGsE(cache, "\n");
      }
      continue;
    } else {
      break;
    }
  }
  _M0IPB13StringBuilderPB6Logger13write__string(buf, _M0MPC15array5Array2atGRPB4JsonE(cache, level));
}
function _M0MPC14json4Json17stringify_2einner(self, escape_slash, indent, replacer) {
  const buf = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  const indent_cache = [];
  const stack = [];
  let depth = 0;
  let _tmp = self;
  while (true) {
    const x = _tmp;
    if (x === undefined) {
      if (stack.length === 0) {
        break;
      } else {
        const _x = stack[stack.length - 1 | 0];
        if (_x.$tag === 0) {
          const _Array = _x;
          const _arr = _Array._0;
          const _i = _Array._1;
          if (_i < _arr.length) {
            const element = _M0MPC15array5Array2atGRPB4JsonE(_arr, _i);
            _Array._1 = _i + 1 | 0;
            if (_i > 0) {
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 44);
              if (indent > 0) {
                _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
              }
            }
            _tmp = element;
            continue;
          } else {
            depth = depth - 1 | 0;
            _M0MPC15array5Array3popGRPC14json10WriteFrameE(stack);
            if (indent > 0) {
              _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
            }
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 93);
            _tmp = undefined;
            continue;
          }
        } else {
          const _Object = _x;
          const _iterator = _Object._0;
          const _first = _Object._1;
          const _bind = _M0MPB4Iter4nextGUsRPB4JsonEE(_iterator);
          if (_bind === undefined) {
            depth = depth - 1 | 0;
            _M0MPC15array5Array3popGRPC14json10WriteFrameE(stack);
            if (indent > 0 && !_first) {
              _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
            }
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 125);
            _tmp = undefined;
            continue;
          } else {
            const _Some = _bind;
            const _x$2 = _Some;
            const _k = _x$2._0;
            const _v = _x$2._1;
            let v2 = _v;
            if (replacer === undefined) {
            } else {
              const _Some$2 = replacer;
              const _replacer = _Some$2;
              const _func = _replacer.f;
              const _bind$2 = _func(_k, _v);
              if (_bind$2 === undefined) {
                _tmp = undefined;
                continue;
              } else {
                const _Some$3 = _bind$2;
                const _v$2 = _Some$3;
                v2 = _v$2;
              }
            }
            if (!_first) {
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 44);
            }
            if (indent > 0) {
              _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
            }
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
            _M0FPC14json14write__escaped(buf, _k, escape_slash);
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 58);
            if (indent > 0) {
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 32);
            }
            _Object._1 = false;
            _tmp = v2;
            continue;
          }
        }
      }
    } else {
      const _Some = x;
      const _value = _Some;
      switch (_value.$tag) {
        case 6: {
          const _Object = _value;
          const _members = _Object._0;
          if (_members.size === 0) {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "{}");
          } else {
            depth = depth + 1 | 0;
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 123);
            _M0MPC15array5Array4pushGsE(stack, new _M0DTPC14json10WriteFrame6Object(_M0MPB3Map4iterGsRPB4JsonE(_members), true));
          }
          break;
        }
        case 5: {
          const _Array = _value;
          const _arr = _Array._0;
          if (_arr.length === 0) {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "[]");
          } else {
            depth = depth + 1 | 0;
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 91);
            if (indent > 0) {
              _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
            }
            _M0MPC15array5Array4pushGsE(stack, new _M0DTPC14json10WriteFrame5Array(_arr, 0));
          }
          break;
        }
        case 4: {
          const _String = _value;
          const _s = _String._0;
          _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
          _M0FPC14json14write__escaped(buf, _s, escape_slash);
          _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
          break;
        }
        case 3: {
          const _Number = _value;
          const _n = _Number._0;
          const _repr = _Number._1;
          if (_repr === undefined) {
            _M0MPB13StringBuilder13write__objectGdE(buf, _n);
          } else {
            const _Some$2 = _repr;
            const _r = _Some$2;
            _M0IPB13StringBuilderPB6Logger13write__string(buf, _r);
          }
          break;
        }
        case 1: {
          _M0IPB13StringBuilderPB6Logger13write__string(buf, "true");
          break;
        }
        case 2: {
          _M0IPB13StringBuilderPB6Logger13write__string(buf, "false");
          break;
        }
        default: {
          _M0IPB13StringBuilderPB6Logger13write__string(buf, "null");
        }
      }
      _tmp = undefined;
      continue;
    }
  }
  return buf.val;
}
function _M0FP36cjyhjy10visionleak4core5field(j, key) {
  if (j.$tag === 6) {
    const _Object = j;
    const _m = _Object._0;
    return _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(_m, key), _M0DTPB4Json4Null__);
  } else {
    return _M0DTPB4Json4Null__;
  }
}
function _M0FP36cjyhjy10visionleak4core14workflow__rows(value, key) {
  const _bind = _M0FP36cjyhjy10visionleak4core5field(value, key);
  if (_bind.$tag === 5) {
    const _Array = _bind;
    return _Array._0;
  } else {
    return [];
  }
}
function _M0FP36cjyhjy10visionleak4core17review__pair__key(left, right) {
  const keys = [left, right];
  _M0MPC15array5Array8sort__byGsE(keys, (a, b) => _M0MPC16string6String16lexical__compare(a, b));
  return _M0MPC14json4Json17stringify_2einner(_M0MPC14json4Json4JsonGRPB5ArrayGsEE(keys), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core4text(j) {
  if (j.$tag === 4) {
    const _String = j;
    return _String._0;
  } else {
    return "";
  }
}
function _M0FP36cjyhjy10visionleak4core13workflow__key(pair) {
  return _M0FP36cjyhjy10visionleak4core17review__pair__key(_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "left")), _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "right")));
}
function _M0FP36cjyhjy10visionleak4core11error__json(code, message) {
  const _p = false;
  const _tmp = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _bind = [{ _0: "code", _1: new _M0DTPB4Json6String(code) }, { _0: "message", _1: new _M0DTPB4Json6String(message) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 2), undefined);
  const _bind$2 = [_tmp, { _0: "error", _1: new _M0DTPB4Json6Object(_p$2) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 2), undefined);
  return new _M0DTPB4Json6Object(_p$3);
}
function _M0FP36cjyhjy10visionleak4core14workflow__gate(report, level) {
  if (!_M0MPC15array5Array8containsGsE(["", "exact", "pixel", "candidate"], level)) {
    return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "fail-on must be exact, pixel, or candidate");
  }
  let bytes = 0;
  let pixels = 0;
  let candidates = 0;
  let locals = 0;
  const _bind = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs");
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const pair = _bind[_];
      const _bind$3 = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"));
      switch (_bind$3) {
        case "byte-identical": {
          bytes = bytes + 1 | 0;
          break;
        }
        case "pixel-identical": {
          pixels = pixels + 1 | 0;
          break;
        }
        case "perceptual-candidate": {
          candidates = candidates + 1 | 0;
          break;
        }
        case "local-candidate": {
          locals = locals + 1 | 0;
          break;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let matched;
  switch (level) {
    case "exact": {
      matched = bytes;
      break;
    }
    case "pixel": {
      matched = bytes + pixels | 0;
      break;
    }
    case "candidate": {
      matched = ((bytes + pixels | 0) + candidates | 0) + locals | 0;
      break;
    }
    default: {
      matched = 0;
    }
  }
  const complete = _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(report, "complete"), _M0MPC14json4Json4JsonGbE(true));
  const _p = true;
  const _tmp$2 = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$3 = { _0: "exitCode", _1: _M0MPC14json4Json4JsonGiE(matched > 0 ? 3 : complete ? 0 : 2) };
  const _tmp$4 = { _0: "failOn", _1: _M0MPC14json4Json4JsonGsE(level) };
  const _tmp$5 = { _0: "matched", _1: _M0MPC14json4Json4JsonGiE(matched) };
  const _tmp$6 = { _0: "complete", _1: _M0MPC14json4Json4JsonGbE(complete) };
  const _bind$3 = [{ _0: "exact", _1: _M0MPC14json4Json4JsonGiE(bytes) }, { _0: "pixel", _1: _M0MPC14json4Json4JsonGiE(pixels) }, { _0: "candidate", _1: _M0MPC14json4Json4JsonGiE(candidates) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 3), undefined);
  const _bind$4 = [_tmp$2, _tmp$3, _tmp$4, _tmp$5, _tmp$6, { _0: "counts", _1: new _M0DTPB4Json6Object(_p$2) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$4, 0, 6), undefined);
  const result = new _M0DTPB4Json6Object(_p$3);
  if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "options"), "includeCrops"), _M0MPC14json4Json4JsonGbE(true))) {
    const _bind$5 = _M0FP36cjyhjy10visionleak4core5field(result, "counts");
    if (_bind$5.$tag === 6) {
      const _Object = _bind$5;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "localCandidate", _M0MPC14json4Json4JsonGiE(locals));
    }
  }
  return result;
}
function _M0FP36cjyhjy10visionleak4core5hex64(s) {
  if (s.length !== 64) {
    return false;
  }
  const _it = _M0MPC16string6String4iter(s);
  while (true) {
    const _bind = _M0MPB4Iter4nextGcE(_it);
    if (_bind === -1) {
      break;
    } else {
      const _Some = _bind;
      const _c = _Some;
      if (!(_c >= 48 && _c <= 57 || _c >= 97 && _c <= 102)) {
        return false;
      }
      continue;
    }
  }
  return true;
}
function _M0FP36cjyhjy10visionleak4core16workflow__verify(report, observations) {
  const _bind = [];
  const images = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 0), undefined);
  const _bind$2 = [];
  const actual = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 0), undefined);
  const _bind$3 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images");
  const _bind$4 = _bind$3.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$4) {
      const image = _bind$3[_];
      _M0MPB3Map3setGsRPB4JsonE(images, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id")), image);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$5 = observations.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$5) {
      const image = observations[_];
      _M0MPB3Map3setGsRPB4JsonE(actual, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id")), image);
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const results = [];
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  let skipped = 0;
  const _bind$6 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs");
  const _bind$7 = _bind$6.length;
  let _tmp$3 = 0;
  while (true) {
    const _ = _tmp$3;
    if (_ < _bind$7) {
      const pair = _bind$6[_];
      _L: {
        const evidence = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"));
        if (!(evidence === "byte-identical" || evidence === "pixel-identical")) {
          skipped = skipped + 1 | 0;
          break _L;
        }
        const left = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "left"));
        const right = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "right"));
        const a = _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(actual, left), _M0DTPB4Json4Null__);
        const b = _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(actual, right), _M0DTPB4Json4Null__);
        const digest = evidence === "byte-identical" ? "byteDigest" : "pixelDigest";
        const expected_a = _M0FP36cjyhjy10visionleak4core5field(_M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(images, left), _M0DTPB4Json4Null__), digest);
        const expected_b = _M0FP36cjyhjy10visionleak4core5field(_M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(images, right), _M0DTPB4Json4Null__), digest);
        const status = _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(a, "status"), _M0MPC14json4Json4JsonGsE("missing")) || _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(b, "status"), _M0MPC14json4Json4JsonGsE("missing")) ? "missing" : _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(a, "status"), _M0MPC14json4Json4JsonGsE("ok")) && (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(b, "status"), _M0MPC14json4Json4JsonGsE("ok")) && (_M0FP36cjyhjy10visionleak4core5hex64(_M0FP36cjyhjy10visionleak4core4text(expected_a)) && (_M0IPC14json4JsonPB2Eq5equal(expected_a, expected_b) && (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(a, digest), expected_a) && _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(b, digest), expected_b))))) ? "valid" : "invalid";
        switch (status) {
          case "valid": {
            valid = valid + 1 | 0;
            break;
          }
          case "missing": {
            missing = missing + 1 | 0;
            break;
          }
          default: {
            invalid = invalid + 1 | 0;
          }
        }
        const _bind$8 = [{ _0: "pairKey", _1: _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core13workflow__key(pair)) }, { _0: "left", _1: _M0MPC14json4Json4JsonGsE(left) }, { _0: "right", _1: _M0MPC14json4Json4JsonGsE(right) }, { _0: "evidence", _1: _M0MPC14json4Json4JsonGsE(evidence) }, { _0: "status", _1: _M0MPC14json4Json4JsonGsE(status) }, { _0: "leftObservation", _1: a }, { _0: "rightObservation", _1: b }];
        const _p = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$8, 0, 7), undefined);
        _M0MPC15array5Array4pushGsE(results, new _M0DTPB4Json6Object(_p));
        break _L;
      }
      _tmp$3 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _tmp$4 = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$5 = { _0: "auditId", _1: _M0FP36cjyhjy10visionleak4core5field(report, "auditId") };
  const _tmp$6 = { _0: "pairs", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(results) };
  const _bind$8 = [{ _0: "valid", _1: _M0MPC14json4Json4JsonGiE(valid) }, { _0: "invalid", _1: _M0MPC14json4Json4JsonGiE(invalid) }, { _0: "missing", _1: _M0MPC14json4Json4JsonGiE(missing) }, { _0: "skippedCandidates", _1: _M0MPC14json4Json4JsonGiE(skipped) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$8, 0, 4), undefined);
  const _bind$9 = [_tmp$4, _tmp$5, _tmp$6, { _0: "counts", _1: new _M0DTPB4Json6Object(_p$2) }, { _0: "exitCode", _1: _M0MPC14json4Json4JsonGiE((invalid + missing | 0) > 0 ? 4 : 0) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 5), undefined);
  return new _M0DTPB4Json6Object(_p$3);
}
function _M0FP36cjyhjy10visionleak4core30workflow__verification__inputs(report) {
  const _bind = [];
  const seen = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind, 0, 0), undefined);
  const ids = [];
  const _bind$2 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs");
  const _bind$3 = _bind$2.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$3) {
      const pair = _bind$2[_];
      _L: {
        const _p = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"));
        if (!(_p === "byte-identical" || _p === "pixel-identical")) {
          break _L;
        }
        const _bind$4 = ["left", "right"];
        const _bind$5 = _bind$4.length;
        let _tmp$2 = 0;
        while (true) {
          const _$2 = _tmp$2;
          if (_$2 < _bind$5) {
            const name = _bind$4[_$2];
            const id = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, name));
            if (!_M0MPB3Map8containsGsbE(seen, id)) {
              _M0MPB3Map3setGsbE(seen, id, true);
              _M0MPC15array5Array4pushGsE(ids, id);
            }
            _tmp$2 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        break _L;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _bind$4 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "ids", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(ids) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$4, 0, 2), undefined);
  return new _M0DTPB4Json6Object(_p$2);
}
function _M0FP36cjyhjy10visionleak4core13sha256__block(h, block) {
  const constants = [1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998];
  const words = _M0MPC15array5Array4makeGjE(64, 0);
  let _tmp = 0;
  while (true) {
    const j = _tmp;
    if (j < 16) {
      let word = 0;
      let _tmp$2 = 0;
      while (true) {
        const k = _tmp$2;
        if (k < 4) {
          const _tmp$3 = word << 8;
          const _tmp$4 = (Math.imul(j, 4) | 0) + k | 0;
          const _p = _tmp$4 >>> 0 < block.length ? block[_tmp$4] : $oob();
          word = _tmp$3 | _p;
          _tmp$2 = k + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0MPC15array5Array3setGjE(words, j, word);
      _tmp = j + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let _tmp$2 = 16;
  while (true) {
    const j = _tmp$2;
    if (j < 64) {
      const x = _M0MPC15array5Array2atGjE(words, j - 15 | 0);
      const y = _M0MPC15array5Array2atGjE(words, j - 2 | 0);
      const _p = 7;
      const _tmp$3 = x >>> _p | x << (32 - _p | 0);
      const _p$2 = 18;
      const s0 = _tmp$3 ^ (x >>> _p$2 | x << (32 - _p$2 | 0)) ^ (x >>> 3 | 0);
      const _p$3 = 17;
      const _tmp$4 = y >>> _p$3 | y << (32 - _p$3 | 0);
      const _p$4 = 19;
      const s1 = _tmp$4 ^ (y >>> _p$4 | y << (32 - _p$4 | 0)) ^ (y >>> 10 | 0);
      _M0MPC15array5Array3setGjE(words, j, (((((_M0MPC15array5Array2atGjE(words, j - 16 | 0) >>> 0) + (s0 >>> 0) | 0) >>> 0) + (_M0MPC15array5Array2atGjE(words, j - 7 | 0) >>> 0) | 0) >>> 0) + (s1 >>> 0) | 0);
      _tmp$2 = j + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let a = _M0MPC15array5Array2atGjE(h, 0);
  let b = _M0MPC15array5Array2atGjE(h, 1);
  let c = _M0MPC15array5Array2atGjE(h, 2);
  let d = _M0MPC15array5Array2atGjE(h, 3);
  let e = _M0MPC15array5Array2atGjE(h, 4);
  let f = _M0MPC15array5Array2atGjE(h, 5);
  let g = _M0MPC15array5Array2atGjE(h, 6);
  let hh = _M0MPC15array5Array2atGjE(h, 7);
  let _tmp$3 = 0;
  while (true) {
    const j = _tmp$3;
    if (j < 64) {
      const _p = e;
      const _p$2 = 6;
      const _tmp$4 = _p >>> _p$2 | _p << (32 - _p$2 | 0);
      const _p$3 = e;
      const _p$4 = 11;
      const _tmp$5 = _tmp$4 ^ (_p$3 >>> _p$4 | _p$3 << (32 - _p$4 | 0));
      const _p$5 = e;
      const _p$6 = 25;
      const s1 = _tmp$5 ^ (_p$5 >>> _p$6 | _p$5 << (32 - _p$6 | 0));
      const choice = e & f ^ (e ^ -1) & g;
      const t1 = (((((((hh >>> 0) + (s1 >>> 0) | 0) >>> 0) + (choice >>> 0) | 0) >>> 0) + (_M0MPC15array5Array2atGjE(constants, j) >>> 0) | 0) >>> 0) + (_M0MPC15array5Array2atGjE(words, j) >>> 0) | 0;
      const _p$7 = a;
      const _p$8 = 2;
      const _tmp$6 = _p$7 >>> _p$8 | _p$7 << (32 - _p$8 | 0);
      const _p$9 = a;
      const _p$10 = 13;
      const _tmp$7 = _tmp$6 ^ (_p$9 >>> _p$10 | _p$9 << (32 - _p$10 | 0));
      const _p$11 = a;
      const _p$12 = 22;
      const s0 = _tmp$7 ^ (_p$11 >>> _p$12 | _p$11 << (32 - _p$12 | 0));
      const majority = a & b ^ a & c ^ b & c;
      const t2 = (s0 >>> 0) + (majority >>> 0) | 0;
      hh = g;
      g = f;
      f = e;
      e = (d >>> 0) + (t1 >>> 0) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 >>> 0) + (t2 >>> 0) | 0;
      _tmp$3 = j + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  _M0MPC15array5Array3setGjE(h, 0, (_M0MPC15array5Array2atGjE(h, 0) >>> 0) + (a >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 1, (_M0MPC15array5Array2atGjE(h, 1) >>> 0) + (b >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 2, (_M0MPC15array5Array2atGjE(h, 2) >>> 0) + (c >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 3, (_M0MPC15array5Array2atGjE(h, 3) >>> 0) + (d >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 4, (_M0MPC15array5Array2atGjE(h, 4) >>> 0) + (e >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 5, (_M0MPC15array5Array2atGjE(h, 5) >>> 0) + (f >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 6, (_M0MPC15array5Array2atGjE(h, 6) >>> 0) + (g >>> 0) | 0);
  _M0MPC15array5Array3setGjE(h, 7, (_M0MPC15array5Array2atGjE(h, 7) >>> 0) + (hh >>> 0) | 0);
}
function _M0FP36cjyhjy10visionleak4core13sha256__final(context) {
  const _bind = context.digest;
  if (_bind === undefined) {
  } else {
    const _Some = _bind;
    const _value = _Some;
    return _value;
  }
  const _tmp = context.pending;
  const _tmp$2 = context.used;
  if (_tmp$2 >>> 0 < _tmp.length) {
    _tmp[_tmp$2] = 128;
  } else {
    $oob();
  }
  context.used = context.used + 1 | 0;
  if (context.used > 56) {
    let _tmp$3 = context.used;
    while (true) {
      const i = _tmp$3;
      if (i < 64) {
        const _tmp$4 = context.pending;
        if (i >>> 0 < _tmp$4.length) {
          _tmp$4[i] = 0;
        } else {
          $oob();
        }
        _tmp$3 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0FP36cjyhjy10visionleak4core13sha256__block(context.state, context.pending);
    context.used = 0;
  }
  let _tmp$3 = context.used;
  while (true) {
    const i = _tmp$3;
    if (i < 56) {
      const _tmp$4 = context.pending;
      if (i >>> 0 < _tmp$4.length) {
        _tmp$4[i] = 0;
      } else {
        $oob();
      }
      _tmp$3 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const bits = BigInt.asUintN(64, context.bytes * 8n);
  let _tmp$4 = 0;
  while (true) {
    const i = _tmp$4;
    if (i < 8) {
      const _tmp$5 = context.pending;
      const _tmp$6 = 56 + i | 0;
      const _p = Number(BigInt.asUintN(32, BigInt.asUintN(64, BigInt.asUintN(64, bits) >> BigInt(Math.imul(7 - i | 0, 8) & 63)))) & 255;
      if (_tmp$6 >>> 0 < _tmp$5.length) {
        _tmp$5[_tmp$6] = _p & 255;
      } else {
        $oob();
      }
      _tmp$4 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  _M0FP36cjyhjy10visionleak4core13sha256__block(context.state, context.pending);
  const out = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  const _bind$2 = context.state;
  const _bind$3 = _bind$2.length;
  let _tmp$5 = 0;
  while (true) {
    const _ = _tmp$5;
    if (_ < _bind$3) {
      const word = _bind$2[_];
      const s = _M0MPC14uint4UInt18to__string_2einner(word, 16);
      let _tmp$6 = s.length;
      while (true) {
        const j = _tmp$6;
        if (j < 8) {
          _M0IPB13StringBuilderPB6Logger13write__string(out, "0");
          _tmp$6 = j + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0IPB13StringBuilderPB6Logger13write__string(out, s);
      _tmp$5 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const digest = out.val;
  context.digest = digest;
  return digest;
}
function _M0FP36cjyhjy10visionleak4core11sha256__new() {
  const h = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225];
  return new _M0TP36cjyhjy10visionleak4core11Sha256State(h, $makebytes(64, 0), 0, 0n, undefined);
}
function _M0FP36cjyhjy10visionleak4core14sha256__update(context, data) {
  _L: {
    _L$2: {
      const _bind = context.digest;
      if (_bind === undefined) {
        const _tmp = context.bytes;
        const _p = data.length;
        if (BigInt.asUintN(64, _tmp) > BigInt.asUintN(64, BigInt.asUintN(64, 2305843009213693951n - BigInt.asUintN(64, BigInt(_p))))) {
          break _L$2;
        }
      } else {
        break _L$2;
      }
      break _L;
    }
    return false;
  }
  const _tmp = context.bytes;
  const _p = data.length;
  context.bytes = BigInt.asUintN(64, _tmp + BigInt.asUintN(64, BigInt(_p)));
  const _bind = data.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind) {
      const byte = data[_];
      const _tmp$3 = context.pending;
      const _tmp$4 = context.used;
      if (_tmp$4 >>> 0 < _tmp$3.length) {
        _tmp$3[_tmp$4] = byte;
      } else {
        $oob();
      }
      context.used = context.used + 1 | 0;
      if (context.used === 64) {
        _M0FP36cjyhjy10visionleak4core13sha256__block(context.state, context.pending);
        context.used = 0;
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return true;
}
function _M0FP36cjyhjy10visionleak4core6sha256(data) {
  const context = _M0FP36cjyhjy10visionleak4core11sha256__new();
  _M0FP36cjyhjy10visionleak4core14sha256__update(context, data);
  return _M0FP36cjyhjy10visionleak4core13sha256__final(context);
}
function _M0FP36cjyhjy10visionleak4core24workflow__component__key(prefix, members) {
  const _bind = _M0MPC14json4Json17stringify_2einner(_M0MPC14json4Json4JsonGRPB5ArrayGsEE(members), false, 0, undefined);
  return `${prefix}-${_M0FP36cjyhjy10visionleak4core6sha256(_M0FPC28encoding4utf814encode_2einner(new _M0TPC16string10StringView(_bind, 0, _bind.length), false))}`;
}
function _M0FP36cjyhjy10visionleak4core4root(parents, i) {
  let p = i;
  while (true) {
    if (_M0MPC15array5Array2atGiE(parents, p) !== p) {
      _M0MPC15array5Array3setGiE(parents, p, _M0MPC15array5Array2atGiE(parents, _M0MPC15array5Array2atGiE(parents, p)));
      p = _M0MPC15array5Array2atGiE(parents, p);
      continue;
    } else {
      break;
    }
  }
  return p;
}
function _M0FP36cjyhjy10visionleak4core20workflow__components(report, confirmed) {
  const images = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images");
  const _bind = [];
  const index = _M0MPB3Map3MapGsiE(new _M0TPB9ArrayViewGUsiEE(_bind, 0, 0), undefined);
  const _bind$2 = images.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind$2) {
      const image = images[i];
      _M0MPB3Map3setGsiE(index, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id")), i);
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = images.length;
  let parents;
  if (_p <= 0) {
    parents = [];
  } else {
    const _p$2 = new Array(_p);
    let _tmp$2 = 0;
    while (true) {
      const _p$3 = _tmp$2;
      if (_p$3 < _p) {
        _p$2[_p$3] = _p$3;
        _tmp$2 = _p$3 + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    parents = _p$2;
  }
  const _bind$3 = [];
  const touched = _M0MPB3Map3MapGibE(new _M0TPB9ArrayViewGUibEE(_bind$3, 0, 0), undefined);
  const _bind$4 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs");
  const _bind$5 = _bind$4.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$5) {
      const pair = _bind$4[_];
      _L: {
        const _p$2 = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"));
        if (!(_p$2 === "perceptual-candidate" || _p$2 === "local-candidate")) {
          break _L;
        }
        if (confirmed === undefined) {
        } else {
          const _Some = confirmed;
          const _keys = _Some;
          if (!_M0MPB3Map8containsGsbE(_keys, _M0FP36cjyhjy10visionleak4core13workflow__key(pair))) {
            break _L;
          }
        }
        const a = _M0MPB3Map3getGsiE(index, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "left")));
        const b = _M0MPB3Map3getGsiE(index, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "right")));
        if (a === undefined) {
        } else {
          const _Some = a;
          const _left = _Some;
          if (b === undefined) {
          } else {
            const _Some$2 = b;
            const _right = _Some$2;
            const ra = _M0FP36cjyhjy10visionleak4core4root(parents, _left);
            const rb = _M0FP36cjyhjy10visionleak4core4root(parents, _right);
            _M0MPC15array5Array3setGiE(parents, rb, ra);
            _M0MPB3Map3setGibE(touched, _left, true);
            _M0MPB3Map3setGibE(touched, _right, true);
          }
        }
        break _L;
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$6 = [];
  const buckets = _M0MPB3Map3MapGiRPB5ArrayGsEE(new _M0TPB9ArrayViewGUiRPB5ArrayGsEEE(_bind$6, 0, 0), undefined);
  const _bind$7 = images.length;
  let _tmp$3 = 0;
  while (true) {
    const i = _tmp$3;
    if (i < _bind$7) {
      const image = images[i];
      _L: {
        if (!_M0MPB3Map8containsGibE(touched, i)) {
          break _L;
        }
        const r = _M0FP36cjyhjy10visionleak4core4root(parents, i);
        const _bind$8 = _M0MPB3Map3getGiRPB5ArrayGsEE(buckets, r);
        if (_bind$8.$tag === 1) {
          const _Some = _bind$8;
          const _members = _Some._0;
          _M0MPC15array5Array4pushGsE(_members, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id")));
        } else {
          _M0MPB3Map3setGiRPB5ArrayGsEE(buckets, r, [_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id"))]);
        }
        break _L;
      }
      _tmp$3 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const groups = [];
  const _it = _M0MPB3Map5iter2GiRPB5ArrayGsEE(buckets);
  while (true) {
    const _bind$8 = _M0MPB5Iter24nextGiRPB5ArrayGsEE(_it);
    if (_bind$8 === undefined) {
      break;
    } else {
      const _Some = _bind$8;
      const _x = _Some;
      const _members = _x._1;
      _M0MPC15array5Array8sort__byGsE(_members, (a, b) => _M0MPC16string6String16lexical__compare(a, b));
      const prefix = confirmed === undefined ? "candidate" : "reviewed-candidate";
      const _bind$9 = [{ _0: "id", _1: _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core24workflow__component__key(prefix, _members)) }, { _0: "members", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(_members) }, { _0: "evidence", _1: _M0MPC14json4Json4JsonGsE(_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "options"), "includeCrops"), _M0MPC14json4Json4JsonGbE(true)) ? "candidate-component" : "perceptual-component") }];
      const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 3), undefined);
      _M0MPC15array5Array4pushGsE(groups, new _M0DTPB4Json6Object(_p$2));
      continue;
    }
  }
  _M0MPC15array5Array8sort__byGsE(groups, (a, b) => _M0MPC16string6String16lexical__compare(_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(a, "id")), _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(b, "id"))));
  return groups;
}
function _M0FP36cjyhjy10visionleak4core14workflow__view(report, show_low, group_id) {
  const groups = _M0FP36cjyhjy10visionleak4core20workflow__components(report, undefined);
  const _bind = [];
  const members = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind, 0, 0), undefined);
  const _bind$2 = groups.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const group = groups[_];
      if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(group, "id"), _M0MPC14json4Json4JsonGsE(group_id))) {
        const _bind$3 = _M0FP36cjyhjy10visionleak4core14workflow__rows(group, "members");
        const _bind$4 = _bind$3.length;
        let _tmp$2 = 0;
        while (true) {
          const _$2 = _tmp$2;
          if (_$2 < _bind$4) {
            const image_id = _bind$3[_$2];
            _M0MPB3Map3setGsbE(members, _M0FP36cjyhjy10visionleak4core4text(image_id), true);
            _tmp$2 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const keys = [];
  let low = 0;
  const _bind$3 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs");
  const _bind$4 = _bind$3.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$4) {
      const pair = _bind$3[_];
      _L: {
        const is_low = _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(pair, "lowContrast"), _M0MPC14json4Json4JsonGbE(true));
        if (is_low) {
          low = low + 1 | 0;
        }
        if (!show_low && is_low) {
          break _L;
        }
        let _tmp$3;
        const _p = "";
        if (!(group_id === _p)) {
          let _tmp$4;
          const _p$2 = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"));
          if (!(_p$2 === "perceptual-candidate" || _p$2 === "local-candidate")) {
            _tmp$4 = true;
          } else {
            _tmp$4 = !_M0MPB3Map8containsGsbE(members, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "left"))) || !_M0MPB3Map8containsGsbE(members, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "right")));
          }
          _tmp$3 = _tmp$4;
        } else {
          _tmp$3 = false;
        }
        if (_tmp$3) {
          break _L;
        }
        _M0MPC15array5Array4pushGsE(keys, _M0FP36cjyhjy10visionleak4core13workflow__key(pair));
        break _L;
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _bind$5 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "keys", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(keys) }, { _0: "lowContrastPairs", _1: _M0MPC14json4Json4JsonGiE(low) }, { _0: "candidateGroups", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(groups) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$5, 0, 4), undefined);
  return new _M0DTPB4Json6Object(_p$2);
}
function _M0FP36cjyhjy10visionleak4core14workflow__rank(image) {
  const _bind = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "split"));
  switch (_bind) {
    case "train": {
      return 0;
    }
    case "validation": {
      return 1;
    }
    case "test": {
      return 2;
    }
    default: {
      return 3;
    }
  }
}
function _M0FP36cjyhjy10visionleak4core19workflow__csv__cell(value) {
  const output = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  _M0IPB13StringBuilderPB6Logger11write__char(output, 34);
  const _it = _M0MPC16string6String4iter(value);
  while (true) {
    const _bind = _M0MPB4Iter4nextGcE(_it);
    if (_bind === -1) {
      break;
    } else {
      const _Some = _bind;
      const _c = _Some;
      if (_c === 34) {
        _M0IPB13StringBuilderPB6Logger11write__char(output, 34);
      }
      _M0IPB13StringBuilderPB6Logger11write__char(output, _c);
      continue;
    }
  }
  _M0IPB13StringBuilderPB6Logger11write__char(output, 34);
  return output.val;
}
function _M0FP36cjyhjy10visionleak4core15workflow__fixes(report, reviews) {
  const _bind = [];
  const images = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 0), undefined);
  const _bind$2 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images");
  const _bind$3 = _bind$2.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$3) {
      const image = _bind$2[_];
      _M0MPB3Map3setGsRPB4JsonE(images, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id")), image);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$4 = [];
  const decisions = _M0MPB3Map3MapGssE(new _M0TPB9ArrayViewGUssEE(_bind$4, 0, 0), undefined);
  const _bind$5 = [];
  const confirmed = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$5, 0, 0), undefined);
  const _bind$6 = reviews.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$6) {
      const review = reviews[_];
      const key = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(review, "pairKey"));
      _M0MPB3Map3setGssE(decisions, key, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(review, "decision")));
      if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(review, "decision"), _M0MPC14json4Json4JsonGsE("confirmed"))) {
        _M0MPB3Map3setGsbE(confirmed, key, true);
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const components = [];
  const _bind$7 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "groups");
  const _bind$8 = _bind$7.length;
  let _tmp$3 = 0;
  while (true) {
    const _ = _tmp$3;
    if (_ < _bind$8) {
      const group = _bind$7[_];
      const _tmp$4 = { _0: "members", _1: _M0FP36cjyhjy10visionleak4core5field(group, "members") };
      const _p = "exact";
      const _bind$9 = [_tmp$4, { _0: "kind", _1: new _M0DTPB4Json6String(_p) }];
      const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 2), undefined);
      _M0MPC15array5Array4pushGsE(components, new _M0DTPB4Json6Object(_p$2));
      _tmp$3 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$9 = _M0FP36cjyhjy10visionleak4core20workflow__components(report, confirmed);
  const _bind$10 = _bind$9.length;
  let _tmp$4 = 0;
  while (true) {
    const _ = _tmp$4;
    if (_ < _bind$10) {
      const group = _bind$9[_];
      const _p = _M0FP36cjyhjy10visionleak4core14workflow__rows(group, "members");
      const _p$2 = new Array(_p.length);
      const _p$3 = _p.length;
      let _tmp$5 = 0;
      while (true) {
        const _p$4 = _tmp$5;
        if (_p$4 < _p$3) {
          const _p$5 = _p[_p$4];
          _p$2[_p$4] = _M0FP36cjyhjy10visionleak4core4text(_p$5);
          _tmp$5 = _p$4 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const ids = _p$2;
      let has_local = false;
      const _bind$11 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs");
      const _bind$12 = _bind$11.length;
      let _tmp$6 = 0;
      while (true) {
        const _$2 = _tmp$6;
        if (_$2 < _bind$12) {
          const pair = _bind$11[_$2];
          if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"), _M0MPC14json4Json4JsonGsE("local-candidate")) && (_M0MPB3Map8containsGsbE(confirmed, _M0FP36cjyhjy10visionleak4core13workflow__key(pair)) && (_M0MPC15array5Array8containsGsE(ids, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "left"))) && _M0MPC15array5Array8containsGsE(ids, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "right")))))) {
            has_local = true;
          }
          _tmp$6 = _$2 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _tmp$7 = { _0: "members", _1: _M0FP36cjyhjy10visionleak4core5field(group, "members") };
      const _p$4 = "reviewed-candidate";
      const _bind$13 = [_tmp$7, { _0: "kind", _1: new _M0DTPB4Json6String(_p$4) }, { _0: "local", _1: _M0MPC14json4Json4JsonGbE(has_local) }];
      const _p$5 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$13, 0, 3), undefined);
      _M0MPC15array5Array4pushGsE(components, new _M0DTPB4Json6Object(_p$5));
      _tmp$4 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const rows = [];
  const csv = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  _M0IPB13StringBuilderPB6Logger13write__string(csv, "group_id,evidence_level,split,path,review_status,suggestion\r\n");
  const _bind$11 = components.length;
  let _tmp$5 = 0;
  while (true) {
    const _ = _tmp$5;
    if (_ < _bind$11) {
      const group = components[_];
      _L: {
        const _p = _M0FP36cjyhjy10visionleak4core14workflow__rows(group, "members");
        const _p$2 = new Array(_p.length);
        const _p$3 = _p.length;
        let _tmp$6 = 0;
        while (true) {
          const _p$4 = _tmp$6;
          if (_p$4 < _p$3) {
            const _p$5 = _p[_p$4];
            _p$2[_p$4] = _M0FP36cjyhjy10visionleak4core4text(_p$5);
            _tmp$6 = _p$4 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        const ids = _p$2;
        if (ids.length < 2) {
          break _L;
        }
        _M0MPC15array5Array8sort__byGsE(ids, (a, b) => {
          const aa = _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(images, a), _M0DTPB4Json4Null__);
          const bb = _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(images, b), _M0DTPB4Json4Null__);
          const priority = _M0FP36cjyhjy10visionleak4core14workflow__rank(aa) - _M0FP36cjyhjy10visionleak4core14workflow__rank(bb) | 0;
          return priority !== 0 ? priority : _M0MPC16string6String16lexical__compare(_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(aa, "path")), _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(bb, "path")));
        });
        const stable = _M0MPC15array5Array4copyGsE(ids);
        _M0MPC15array5Array8sort__byGsE(stable, (a, b) => _M0MPC16string6String16lexical__compare(a, b));
        const kind = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(group, "kind"));
        const id = _M0FP36cjyhjy10visionleak4core24workflow__component__key(kind, stable);
        const keeper = _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(images, _M0MPC15array5Array2atGRPB4JsonE(ids, 0)), _M0DTPB4Json4Null__);
        const _bind$12 = ids.length;
        let _tmp$7 = 0;
        while (true) {
          const i = _tmp$7;
          if (i < _bind$12) {
            const image_id = ids[i];
            const image = _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(images, image_id), _M0DTPB4Json4Null__);
            const evidence = kind === "reviewed-candidate" ? (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(group, "local"), _M0MPC14json4Json4JsonGbE(true)) ? "local-candidate" : "perceptual-candidate") : _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(image, "byteDigest"), _M0FP36cjyhjy10visionleak4core5field(keeper, "byteDigest")) && _M0FP36cjyhjy10visionleak4core5hex64(_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "byteDigest"))) ? "byte-identical" : "pixel-identical";
            const decision = kind === "reviewed-candidate" ? "confirmed" : _M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGssE(decisions, _M0FP36cjyhjy10visionleak4core17review__pair__key(_M0MPC15array5Array2atGRPB4JsonE(ids, 0), image_id)), "pending");
            const split = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "split"));
            const suggestion = i === 0 ? "keep" : `remove-from-${split}`;
            const path = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "path"));
            const values = [id, evidence, split, path, decision, suggestion];
            const _bind$13 = values.length;
            let _tmp$8 = 0;
            while (true) {
              const col = _tmp$8;
              if (col < _bind$13) {
                const value = values[col];
                if (col > 0) {
                  _M0IPB13StringBuilderPB6Logger11write__char(csv, 44);
                }
                _M0IPB13StringBuilderPB6Logger13write__string(csv, _M0FP36cjyhjy10visionleak4core19workflow__csv__cell(value));
                _tmp$8 = col + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            _M0IPB13StringBuilderPB6Logger13write__string(csv, "\r\n");
            const _bind$14 = [{ _0: "group_id", _1: _M0MPC14json4Json4JsonGsE(id) }, { _0: "evidence_level", _1: _M0MPC14json4Json4JsonGsE(evidence) }, { _0: "split", _1: _M0MPC14json4Json4JsonGsE(split) }, { _0: "path", _1: _M0MPC14json4Json4JsonGsE(path) }, { _0: "review_status", _1: _M0MPC14json4Json4JsonGsE(decision) }, { _0: "suggestion", _1: _M0MPC14json4Json4JsonGsE(suggestion) }];
            const _p$4 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$14, 0, 6), undefined);
            _M0MPC15array5Array4pushGsE(rows, new _M0DTPB4Json6Object(_p$4));
            _tmp$7 = i + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        break _L;
      }
      _tmp$5 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _bind$12 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "csv", _1: _M0MPC14json4Json4JsonGsE(csv.val) }, { _0: "rows", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(rows) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$12, 0, 3), undefined);
  return new _M0DTPB4Json6Object(_p$2);
}
function _M0FP36cjyhjy10visionleak4core15workflow__split(path, directories) {
  const parts = _M0MPB4Iter9to__arrayGsE(_M0MPB4Iter3mapGRPC16string10StringViewsE(_M0MPC16string6String5split(path, new _M0TPC16string10StringView(_M0FP36cjyhjy10visionleak4core15workflow__splitN7_2abindS3183, 0, _M0FP36cjyhjy10visionleak4core15workflow__splitN7_2abindS3183.length)), (p) => _M0MPC16string10StringView9to__owned(p)));
  if (parts.length === 0) {
    return "unknown";
  } else {
    const split = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(directories, _M0MPC15array5Array2atGRPB4JsonE(parts, 0)));
    return split === "" ? "unknown" : split;
  }
}
function _M0FP36cjyhjy10visionleak4core7integer(j) {
  if (j.$tag === 3) {
    const _Number = j;
    const _n = _Number._0;
    return _n >= 0 && (_n <= 2147483647 && _M0MPC16double6Double7to__int(_n) + 0 === _n) ? _M0MPC16double6Double7to__int(_n) : -1;
  } else {
    return -1;
  }
}
function _M0FP36cjyhjy10visionleak4core18workflow__coverage(request) {
  const report = _M0FP36cjyhjy10visionleak4core5field(request, "report");
  const directories = _M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "scope"), "splitDirectories");
  const _bind = [];
  const audited = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind, 0, 0), undefined);
  const _bind$2 = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images");
  const _bind$3 = _bind$2.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$3) {
      const image = _bind$2[_];
      _M0MPB3Map3setGsbE(audited, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "path")), true);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$4 = [];
  const rejected = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$4, 0, 0), undefined);
  const budgets = [];
  const errors = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "errors");
  const _bind$5 = errors.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$5) {
      const error = errors[_];
      const path = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(error, "path"));
      const _p = "";
      if (!(path === _p)) {
        _M0MPB3Map3setGsbE(rejected, path, true);
      }
      const code = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(error, "code"));
      if (_M0MPC16string6String11has__suffix(code, new _M0TPC16string10StringView(_M0FP36cjyhjy10visionleak4core18workflow__coverageN7_2abindS3192, 0, _M0FP36cjyhjy10visionleak4core18workflow__coverageN7_2abindS3192.length))) {
        _M0MPC15array5Array4pushGsE(budgets, error);
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const reason = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "stats"), "reason"));
  const images = _M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images");
  const processed_value = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "stats"), "processedImages"));
  const processed = processed_value < 0 ? images.length : processed_value;
  let _tmp$3;
  const _p = "";
  if (!(reason === _p)) {
    const _p$2 = "no-decodable-images";
    _tmp$3 = !(reason === _p$2);
  } else {
    _tmp$3 = false;
  }
  if (_tmp$3) {
    const _tmp$4 = { _0: "code", _1: _M0MPC14json4Json4JsonGsE(reason) };
    const _p$2 = "core-comparison";
    const _bind$6 = [_tmp$4, { _0: "stage", _1: new _M0DTPB4Json6String(_p$2) }, { _0: "processedImages", _1: _M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "stats"), "processedImages") }, { _0: "emittedPairs", _1: _M0FP36cjyhjy10visionleak4core5field(_M0FP36cjyhjy10visionleak4core5field(report, "stats"), "emittedPairs") }, { _0: "atImage", _1: processed < images.length ? _M0FP36cjyhjy10visionleak4core5field(_M0MPC15array5Array2atGRPB4JsonE(images, processed), "path") : _M0DTPB4Json4Null__ }];
    const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 5), undefined);
    _M0MPC15array5Array4pushGsE(budgets, new _M0DTPB4Json6Object(_p$3));
  }
  const summary = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  _M0IPB13StringBuilderPB6Logger13write__string(summary, "已审计 ");
  const _bind$6 = [];
  const splits = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 0), undefined);
  let rejected_total = 0;
  let ignored_total = 0;
  let unprocessed_total = 0;
  const _bind$7 = ["train", "validation", "test", "unknown"];
  const _bind$8 = _bind$7.length;
  let _tmp$4 = 0;
  while (true) {
    const n = _tmp$4;
    if (n < _bind$8) {
      const split = _bind$7[n];
      let count = 0;
      let fingerprinted = 0;
      let ignored = 0;
      let unprocessed = 0;
      const _bind$9 = [];
      const reasons = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 0), undefined);
      const _bind$10 = images.length;
      let _tmp$5 = 0;
      while (true) {
        const i = _tmp$5;
        if (i < _bind$10) {
          const image = images[i];
          if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(image, "split"), _M0MPC14json4Json4JsonGsE(split))) {
            fingerprinted = fingerprinted + 1 | 0;
            if (i < processed) {
              count = count + 1 | 0;
            } else {
              unprocessed = unprocessed + 1 | 0;
            }
          }
          _tmp$5 = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$11 = errors.length;
      let _tmp$6 = 0;
      while (true) {
        const _ = _tmp$6;
        if (_ < _bind$11) {
          const error = errors[_];
          const path = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(error, "path"));
          if (_M0FP36cjyhjy10visionleak4core15workflow__split(path, directories) === split) {
            const code = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(error, "code"));
            const before = _M0FP36cjyhjy10visionleak4core7integer(_M0MPC16option6Option10unwrap__orGRPB4JsonE(_M0MPB3Map3getGsRPB4JsonE(reasons, code), _M0MPC14json4Json4JsonGiE(0)));
            _M0MPB3Map3setGsRPB4JsonE(reasons, code, _M0MPC14json4Json4JsonGiE(before + 1 | 0));
            rejected_total = rejected_total + 1 | 0;
          }
          _tmp$6 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$12 = _M0FP36cjyhjy10visionleak4core14workflow__rows(request, "ignored");
      const _bind$13 = _bind$12.length;
      let _tmp$7 = 0;
      while (true) {
        const _ = _tmp$7;
        if (_ < _bind$13) {
          const image = _bind$12[_];
          if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(image, "split"), _M0MPC14json4Json4JsonGsE(split))) {
            ignored = ignored + 1 | 0;
          }
          _tmp$7 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$14 = _M0FP36cjyhjy10visionleak4core14workflow__rows(request, "discovered");
      const _bind$15 = _bind$14.length;
      let _tmp$8 = 0;
      while (true) {
        const _ = _tmp$8;
        if (_ < _bind$15) {
          const image = _bind$14[_];
          const path = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "path"));
          if (_M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(image, "split"), _M0MPC14json4Json4JsonGsE(split)) && (!_M0MPB3Map8containsGsbE(audited, path) && !_M0MPB3Map8containsGsbE(rejected, path))) {
            unprocessed = unprocessed + 1 | 0;
          }
          _tmp$8 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      ignored_total = ignored_total + ignored | 0;
      unprocessed_total = unprocessed_total + unprocessed | 0;
      const _bind$16 = [{ _0: "audited", _1: _M0MPC14json4Json4JsonGiE(count) }, { _0: "fingerprinted", _1: _M0MPC14json4Json4JsonGiE(fingerprinted) }, { _0: "rejectedByCode", _1: new _M0DTPB4Json6Object(reasons) }, { _0: "ignored", _1: _M0MPC14json4Json4JsonGiE(ignored) }, { _0: "unprocessed", _1: _M0MPC14json4Json4JsonGiE(unprocessed) }];
      const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$16, 0, 5), undefined);
      _M0MPB3Map3setGsRPB4JsonE(splits, split, new _M0DTPB4Json6Object(_p$2));
      if (n < 3) {
        if (n > 0) {
          _M0IPB13StringBuilderPB6Logger13write__string(summary, " / ");
        }
        _M0IPB13StringBuilderPB6Logger13write__string(summary, `${split} ${_M0MPC13int3Int18to__string_2einner(count, 10)}`);
      }
      _tmp$4 = n + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  _M0IPB13StringBuilderPB6Logger13write__string(summary, `；拒收/错误 ${_M0MPC13int3Int18to__string_2einner(rejected_total, 10)}；忽略 ${_M0MPC13int3Int18to__string_2einner(ignored_total, 10)}；已发现但未审计 ${_M0MPC13int3Int18to__string_2einner(unprocessed_total, 10)}`);
  _M0IPB13StringBuilderPB6Logger13write__string(summary, "；结论只覆盖已审计输入与已完成比较。");
  const _p$2 = true;
  const _tmp$5 = { _0: "ok", _1: _p$2 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$6 = { _0: "splits", _1: new _M0DTPB4Json6Object(splits) };
  const _tmp$7 = { _0: "budgetExhaustion", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(budgets) };
  let _tmp$8;
  let _p$3;
  _L: {
    _L$2: {
      const _p$4 = errors.length;
      let _tmp$9 = 0;
      while (true) {
        const _p$5 = _tmp$9;
        if (_p$5 < _p$4) {
          const _p$6 = errors[_p$5];
          if (_M0MPC15array5Array8containsGsE(["ENTRY_BUDGET", "IMAGE_BUDGET", "READ_ERROR", "PATH_DEPTH_BUDGET"], _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(_p$6, "code")))) {
            _p$3 = true;
            break _L$2;
          }
          _tmp$9 = _p$5 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp$8 = false;
      break _L;
    }
    _tmp$8 = _p$3;
  }
  const _bind$9 = [_tmp$6, _tmp$7, { _0: "enumerationComplete", _1: _M0MPC14json4Json4JsonGbE(!_tmp$8) }, { _0: "rejectedOrErrorCount", _1: _M0MPC14json4Json4JsonGiE(rejected_total) }, { _0: "ignoredFiles", _1: _M0MPC14json4Json4JsonGiE(ignored_total) }, { _0: "unprocessedKnownFiles", _1: _M0MPC14json4Json4JsonGiE(unprocessed_total) }, { _0: "summary", _1: _M0MPC14json4Json4JsonGsE(summary.val) }];
  const _p$4 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 7), undefined);
  const _bind$10 = [_tmp$5, { _0: "coverage", _1: new _M0DTPB4Json6Object(_p$4) }];
  const _p$5 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$10, 0, 2), undefined);
  return new _M0DTPB4Json6Object(_p$5);
}
function _M0FP36cjyhjy10visionleak4core14bounded__depth(source, maximum) {
  let depth = 0;
  let quoted = false;
  let escaped = false;
  const _it = _M0MPC16string6String4iter(source);
  while (true) {
    const _bind = _M0MPB4Iter4nextGcE(_it);
    if (_bind === -1) {
      break;
    } else {
      const _Some = _bind;
      const _c = _Some;
      if (quoted) {
        if (escaped) {
          escaped = false;
        } else {
          if (_c === 92) {
            escaped = true;
          } else {
            if (_c === 34) {
              quoted = false;
            }
          }
        }
      } else {
        if (_c === 34) {
          quoted = true;
        } else {
          if (_c === 91 || _c === 123) {
            depth = depth + 1 | 0;
            if (depth > maximum) {
              return false;
            }
          } else {
            if (_c === 93 || _c === 125) {
              depth = depth - 1 | 0;
              if (depth < 0) {
                return false;
              }
            }
          }
        }
      }
      continue;
    }
  }
  return true;
}
function _M0FP36cjyhjy10visionleak4core17workflow__offline(request) {
  const maximum = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(request, "maxBytes"));
  const header = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(request, "headerBytes"));
  if (maximum < 4096 || (maximum > 67108864 || (header < 0 || header > maximum))) {
    return _M0FP36cjyhjy10visionleak4core11error__json("EXPORT_SIZE_LIMIT", "Offline export metadata exceeds the byte limit");
  }
  const rows = _M0FP36cjyhjy10visionleak4core14workflow__rows(request, "rows");
  const selected = [];
  let used = header;
  const _bind = rows.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      const row = rows[i];
      const size = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(row, "bytes"));
      if (size < 0) {
        return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Invalid offline row size");
      }
      if (size <= (maximum - used | 0)) {
        _M0MPC15array5Array4pushGiE(selected, i);
        used = used + size | 0;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _bind$2 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "selected", _1: _M0MPC14json4Json4JsonGRPB5ArrayGiEE(selected) }, { _0: "estimatedBytes", _1: _M0MPC14json4Json4JsonGiE(used) }, { _0: "truncated", _1: _M0MPC14json4Json4JsonGbE(selected.length !== rows.length) }, { _0: "includedPairs", _1: _M0MPC14json4Json4JsonGiE(selected.length) }, { _0: "omittedPairs", _1: _M0MPC14json4Json4JsonGiE(rows.length - selected.length | 0) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 6), undefined);
  return new _M0DTPB4Json6Object(_p$2);
}
function _M0FP36cjyhjy10visionleak4core27workflow__offline__metadata(report, maximum) {
  if (maximum < 4096 || maximum > 67108864) {
    return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Offline limit must be 4096..67108864");
  }
  const _bind = _M0MPC14json4Json17stringify_2einner(report, false, 0, undefined);
  const encoded_size = Math.imul((_M0FPC28encoding4utf814encode_2einner(new _M0TPC16string10StringView(_bind, 0, _bind.length), false).length + 2 | 0) / 3 | 0, 4) | 0;
  const truncated = encoded_size > (maximum / 2 | 0);
  let embedded;
  if (truncated) {
    const _p = "visionleak-report-snapshot-v1";
    const _tmp = { _0: "schemaVersion", _1: new _M0DTPB4Json6String(_p) };
    const _tmp$2 = { _0: "sourceAuditId", _1: _M0FP36cjyhjy10visionleak4core5field(report, "auditId") };
    const _tmp$3 = { _0: "originalComplete", _1: _M0FP36cjyhjy10visionleak4core5field(report, "complete") };
    const _p$2 = false;
    const _tmp$4 = { _0: "complete", _1: _p$2 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
    const _p$3 = [];
    const _tmp$5 = { _0: "images", _1: new _M0DTPB4Json5Array(_p$3) };
    const _p$4 = [];
    const _tmp$6 = { _0: "pairs", _1: new _M0DTPB4Json5Array(_p$4) };
    const _p$5 = "报告 JSON 超出内嵌预算，已裁剪；已包含配对的完整证据与复核记录在 evidence 中。";
    const _bind$2 = [_tmp, _tmp$2, _tmp$3, _tmp$4, _tmp$5, _tmp$6, { _0: "notice", _1: new _M0DTPB4Json6String(_p$5) }];
    const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 7), undefined);
    embedded = new _M0DTPB4Json6Object(_p$6);
  } else {
    embedded = report;
  }
  const _p = true;
  const _tmp = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _p$2 = "visionleak-offline-v1";
  const _bind$2 = [{ _0: "schemaVersion", _1: new _M0DTPB4Json6String(_p$2) }, { _0: "auditId", _1: _M0FP36cjyhjy10visionleak4core5field(report, "auditId") }, { _0: "complete", _1: _M0FP36cjyhjy10visionleak4core5field(report, "complete") }, { _0: "totalImages", _1: _M0MPC14json4Json4JsonGiE(_M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images").length) }, { _0: "totalPairs", _1: _M0MPC14json4Json4JsonGiE(_M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs").length) }, { _0: "reportTruncated", _1: _M0MPC14json4Json4JsonGbE(truncated) }, { _0: "report", _1: embedded }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 7), undefined);
  const _bind$3 = [_tmp, { _0: "metadata", _1: new _M0DTPB4Json6Object(_p$3) }];
  const _p$4 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 2), undefined);
  return new _M0DTPB4Json6Object(_p$4);
}
function _M0FP36cjyhjy10visionleak4core14workflow__json(source) {
  if (source.length > 67108864 || !_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 32)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("WorkflowBudget", "Workflow input exceeds its bounded budget"), false, 0, undefined);
  }
  let request;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        request = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidJson", "Invalid workflow JSON"), false, 0, undefined);
  }
  const report = _M0FP36cjyhjy10visionleak4core5field(request, "report");
  if (_M0FP36cjyhjy10visionleak4core14workflow__rows(report, "images").length > 10000 || (_M0FP36cjyhjy10visionleak4core14workflow__rows(report, "pairs").length > 100000 || (_M0FP36cjyhjy10visionleak4core14workflow__rows(request, "rows").length > 100000 || _M0FP36cjyhjy10visionleak4core14workflow__rows(request, "ignored").length > 100000))) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("WorkflowBudget", "Workflow collection exceeds its bounded budget"), false, 0, undefined);
  }
  const operation = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(request, "operation"));
  let result;
  switch (operation) {
    case "gate": {
      result = _M0FP36cjyhjy10visionleak4core14workflow__gate(report, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(request, "failOn")));
      break;
    }
    case "coverage": {
      result = _M0FP36cjyhjy10visionleak4core18workflow__coverage(request);
      break;
    }
    case "verify": {
      result = _M0FP36cjyhjy10visionleak4core16workflow__verify(report, _M0FP36cjyhjy10visionleak4core14workflow__rows(request, "observations"));
      break;
    }
    case "verificationInputs": {
      result = _M0FP36cjyhjy10visionleak4core30workflow__verification__inputs(report);
      break;
    }
    case "view": {
      result = _M0FP36cjyhjy10visionleak4core14workflow__view(report, _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(request, "includeLowContrast"), _M0MPC14json4Json4JsonGbE(true)), _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(request, "groupId")));
      break;
    }
    case "groups": {
      const _p = true;
      const _bind = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "candidateGroups", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(_M0FP36cjyhjy10visionleak4core20workflow__components(report, undefined)) }];
      const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 2), undefined);
      result = new _M0DTPB4Json6Object(_p$2);
      break;
    }
    case "fixes": {
      result = _M0FP36cjyhjy10visionleak4core15workflow__fixes(report, _M0FP36cjyhjy10visionleak4core14workflow__rows(request, "reviews"));
      break;
    }
    case "offline": {
      result = _M0FP36cjyhjy10visionleak4core17workflow__offline(request);
      break;
    }
    case "offlineMetadata": {
      result = _M0FP36cjyhjy10visionleak4core27workflow__offline__metadata(report, _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(request, "maxBytes")));
      break;
    }
    default: {
      result = _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Unknown workflow operation");
    }
  }
  return _M0MPC14json4Json17stringify_2einner(result, false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core14sampling__plan(width, height, maximum) {
  if (width <= 0 || (height <= 0 || (width > 65535 || (height > 65535 || (width > (100000000 / height | 0) || (maximum < 1 || maximum > 4194304)))))) {
    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidSamplingBudget", "Dimensions or perception pixel cap are outside the documented bounds");
  }
  const downsampled = (Math.imul(width, height) | 0) > maximum;
  const scale = downsampled ? Math.sqrt((maximum + 0) / ((Math.imul(width, height) | 0) + 0)) : 1;
  const _p = 1;
  const _p$2 = _M0MPC16double6Double7to__int((width + 0) * scale);
  const _p$3 = maximum < _p$2 ? maximum : _p$2;
  const w = _p > _p$3 ? _p : _p$3;
  const _p$4 = 1;
  const _p$5 = maximum / w | 0;
  const _p$6 = _M0MPC16double6Double7to__int((height + 0) * scale);
  const _p$7 = _p$5 < _p$6 ? _p$5 : _p$6;
  const h = _p$4 > _p$7 ? _p$4 : _p$7;
  const _p$8 = true;
  const _bind = [{ _0: "ok", _1: _p$8 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "width", _1: _M0MPC14json4Json4JsonGiE(w) }, { _0: "height", _1: _M0MPC14json4Json4JsonGiE(h) }, { _0: "downsampled", _1: _M0MPC14json4Json4JsonGbE(downsampled) }, { _0: "sourceWidth", _1: _M0MPC14json4Json4JsonGiE(width) }, { _0: "sourceHeight", _1: _M0MPC14json4Json4JsonGiE(height) }];
  const _p$9 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 6), undefined);
  return new _M0DTPB4Json6Object(_p$9);
}
function _M0FP36cjyhjy10visionleak4core20sampling__plan__json(width, height, maximum) {
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core14sampling__plan(width, height, maximum), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core8nonempty(value) {
  if (value.$tag === 4) {
    const _String = value;
    const _s = _String._0;
    const _bind = _M0MPC16string6String4trim(_s, undefined);
    return (_bind.end - _bind.start | 0) > 0;
  } else {
    return false;
  }
}
function _M0FP36cjyhjy10visionleak4core13null__default(value, fallback) {
  if (value.$tag === 0) {
    return fallback;
  } else {
    return value;
  }
}
function _M0FP36cjyhjy10visionleak4core15evidence__known(value) {
  return _M0MPC15array5Array8containsGsE(["byte-identical", "pixel-identical", "perceptual-candidate", "local-candidate"], value);
}
function _M0FP36cjyhjy10visionleak4core15decision__known(value) {
  return _M0MPC15array5Array8containsGsE(["confirmed", "rejected", "unsure"], value);
}
function _M0FP36cjyhjy10visionleak4core18orientation__known(value, mirrors) {
  const normal = ["original", "rotate90", "rotate180", "rotate270"];
  const reflected = ["mirror", "rotate90-mirror", "rotate180-mirror", "rotate270-mirror"];
  return _M0MPC15array5Array8containsGsE(normal, value) || mirrors && _M0MPC15array5Array8containsGsE(reflected, value);
}
function _M0FP36cjyhjy10visionleak4core23validate__report__value(value) {
  if (value.$tag === 6) {
    if (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(value, "schemaVersion"), _M0MPC14json4Json4JsonGsE("visionleak-report-v1"))) {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "不支持的报告格式，需要 visionleak-report-v1。");
    }
    if (!_M0FP36cjyhjy10visionleak4core8nonempty(_M0FP36cjyhjy10visionleak4core5field(value, "auditId"))) {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "auditId 必须是非空字符串。");
    }
    const _bind = _M0FP36cjyhjy10visionleak4core5field(value, "images");
    if (_bind.$tag === 5) {
      const _Array = _bind;
      const _raw_images = _Array._0;
      const _bind$2 = _M0FP36cjyhjy10visionleak4core5field(value, "pairs");
      if (_bind$2.$tag === 5) {
        const _Array$2 = _bind$2;
        const _raw_pairs = _Array$2._0;
        const images = [];
        const _bind$3 = [];
        const splits = _M0MPB3Map3MapGssE(new _M0TPB9ArrayViewGUssEE(_bind$3, 0, 0), undefined);
        const _bind$4 = _raw_images.length;
        let _tmp = 0;
        while (true) {
          const _ = _tmp;
          if (_ < _bind$4) {
            const raw = _raw_images[_];
            if (raw.$tag === 6) {
              const _Object = raw;
              const _fields = _Object._0;
              const id = _M0FP36cjyhjy10visionleak4core13null__default(_M0FP36cjyhjy10visionleak4core5field(raw, "id"), _M0FP36cjyhjy10visionleak4core5field(raw, "path"));
              const path = _M0FP36cjyhjy10visionleak4core13null__default(_M0FP36cjyhjy10visionleak4core5field(raw, "path"), _M0FP36cjyhjy10visionleak4core5field(raw, "id"));
              const split = _M0FP36cjyhjy10visionleak4core5field(raw, "split");
              if (!_M0FP36cjyhjy10visionleak4core8nonempty(id) || (!_M0FP36cjyhjy10visionleak4core8nonempty(path) || !_M0FP36cjyhjy10visionleak4core8nonempty(split))) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "图像 id、路径、split 必须是非空字符串。");
              }
              if (_M0MPB3Map8containsGssE(splits, _M0FP36cjyhjy10visionleak4core4text(id))) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", `图像 id 重复：${_M0FP36cjyhjy10visionleak4core4text(id)}`);
              }
              _M0MPB3Map3setGssE(splits, _M0FP36cjyhjy10visionleak4core4text(id), _M0FP36cjyhjy10visionleak4core4text(split));
              _M0MPB3Map3setGsRPB4JsonE(_fields, "id", id);
              _M0MPB3Map3setGsRPB4JsonE(_fields, "path", path);
              _M0MPC15array5Array4pushGsE(images, raw);
            } else {
              return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "图像记录 必须是对象。");
            }
            _tmp = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        const pairs = [];
        const _bind$5 = [];
        const keys = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$5, 0, 0), undefined);
        const options = _M0FP36cjyhjy10visionleak4core5field(value, "options");
        const mirrors = _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(options, "includeMirrors"), _M0MPC14json4Json4JsonGbE(true));
        const rotations = _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(options, "includeRotations"), _M0MPC14json4Json4JsonGbE(true));
        const _bind$6 = _raw_pairs.length;
        let _tmp$2 = 0;
        while (true) {
          const _ = _tmp$2;
          if (_ < _bind$6) {
            const raw = _raw_pairs[_];
            if (raw.$tag === 6) {
              const _Object = raw;
              const _fields = _Object._0;
              const left = _M0FP36cjyhjy10visionleak4core5field(raw, "left");
              const right = _M0FP36cjyhjy10visionleak4core5field(raw, "right");
              if (!_M0FP36cjyhjy10visionleak4core8nonempty(left) || !_M0FP36cjyhjy10visionleak4core8nonempty(right)) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "left、right 必须是非空字符串。");
              }
              const a = _M0FP36cjyhjy10visionleak4core4text(left);
              const b = _M0FP36cjyhjy10visionleak4core4text(right);
              if (!_M0MPB3Map8containsGssE(splits, a) || !_M0MPB3Map8containsGssE(splits, b)) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "证据对引用了报告中不存在的图像。");
              }
              if (a === b || _M0MPB3Map2atGssE(splits, a) === _M0MPB3Map2atGssE(splits, b)) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "证据对必须是来自不同 split 的两张图像。");
              }
              const evidence = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(raw, "evidence"));
              if (!_M0FP36cjyhjy10visionleak4core15evidence__known(evidence)) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", `未知证据等级：${evidence}`);
              }
              if (evidence === "local-candidate") {
                const witness = _M0FP36cjyhjy10visionleak4core5field(raw, "matchLocal");
                const a$2 = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(witness, "leftWindow"));
                const b$2 = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(witness, "rightWindow"));
                if (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(options, "includeCrops"), _M0MPC14json4Json4JsonGbE(true)) || (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(witness, "profile"), _M0MPC14json4Json4JsonGsE("vl-local-dhash-v1")) || (a$2 < 0 || (a$2 >= 20 || (b$2 < 0 || b$2 >= 20))))) {
                  return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "局部候选必须记录有效的裁切窗口与审计配置。");
                }
              }
              const transform = _M0FP36cjyhjy10visionleak4core5field(raw, "matchTransform");
              let _tmp$3;
              if (transform.$tag === 0) {
                _tmp$3 = true;
              } else {
                _tmp$3 = false;
              }
              if (!_tmp$3) {
                let _tmp$4;
                if (!mirrors) {
                  _tmp$4 = true;
                } else {
                  let _tmp$5;
                  const _p = "perceptual-candidate";
                  if (!(evidence === _p)) {
                    _tmp$5 = true;
                  } else {
                    _tmp$5 = !_M0MPC15array5Array8containsGsE(["original", "mirror-left", "mirror-right", "mirror-both"], _M0FP36cjyhjy10visionleak4core4text(transform));
                  }
                  _tmp$4 = _tmp$5;
                }
                if (_tmp$4) {
                  return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "镜像匹配依据与证据或审计配置不一致。");
                }
              }
              const orientation = _M0FP36cjyhjy10visionleak4core5field(raw, "matchOrientation");
              let _tmp$4;
              if (orientation.$tag === 0) {
                _tmp$4 = true;
              } else {
                _tmp$4 = false;
              }
              if (!_tmp$4) {
                const views = _M0MPB4Iter9to__arrayGsE(_M0MPB4Iter3mapGRPC16string10StringViewsE(_M0MPC16string6String5split(_M0FP36cjyhjy10visionleak4core4text(orientation), new _M0TPC16string10StringView(_M0FP36cjyhjy10visionleak4core23validate__report__valueN7_2abindS3323, 0, _M0FP36cjyhjy10visionleak4core23validate__report__valueN7_2abindS3323.length)), (v) => _M0MPC16string10StringView9to__owned(v)));
                let _tmp$5;
                let _tmp$6;
                if (transform.$tag === 0) {
                  _tmp$6 = true;
                } else {
                  _tmp$6 = false;
                }
                if (!_tmp$6) {
                  _tmp$5 = true;
                } else {
                  let _tmp$7;
                  const _p = "perceptual-candidate";
                  if (!(evidence === _p)) {
                    _tmp$7 = true;
                  } else {
                    _tmp$7 = !rotations || (views.length !== 2 || (!_M0FP36cjyhjy10visionleak4core18orientation__known(_M0MPC15array5Array2atGRPB4JsonE(views, 0), mirrors) || !_M0FP36cjyhjy10visionleak4core18orientation__known(_M0MPC15array5Array2atGRPB4JsonE(views, 1), mirrors)));
                  }
                  _tmp$5 = _tmp$7;
                }
                if (_tmp$5) {
                  return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "旋转匹配依据与证据或审计配置不一致。");
                }
              }
              const distance = _M0FP36cjyhjy10visionleak4core13null__default(_M0FP36cjyhjy10visionleak4core5field(raw, "distance"), evidence === "perceptual-candidate" || evidence === "local-candidate" ? _M0DTPB4Json4Null__ : _M0MPC14json4Json4JsonGiE(0));
              if (_M0FP36cjyhjy10visionleak4core7integer(distance) < 0 || _M0FP36cjyhjy10visionleak4core7integer(distance) > 64) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "证据距离必须是 0 到 64 的非负整数。");
              }
              const key = _M0FP36cjyhjy10visionleak4core17review__pair__key(a, b);
              if (_M0MPB3Map8containsGsbE(keys, key)) {
                return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "报告包含重复的证据对。");
              }
              _M0MPB3Map3setGsbE(keys, key, true);
              _M0MPB3Map3setGsRPB4JsonE(_fields, "key", _M0MPC14json4Json4JsonGsE(key));
              _M0MPB3Map3setGsRPB4JsonE(_fields, "distance", distance);
              _M0MPC15array5Array4pushGsE(pairs, raw);
            } else {
              return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "证据对 必须是对象。");
            }
            _tmp$2 = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        const errors = _M0FP36cjyhjy10visionleak4core5field(value, "errors");
        let has_errors = false;
        switch (errors.$tag) {
          case 0: {
            break;
          }
          case 5: {
            const _Array$3 = errors;
            const _values = _Array$3._0;
            has_errors = _values.length > 0;
            break;
          }
          default: {
            return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "报告 errors 必须是数组。");
          }
        }
        const complete = _M0IPC14json4JsonPB2Eq5equal(_M0FP36cjyhjy10visionleak4core5field(value, "complete"), _M0MPC14json4Json4JsonGbE(true)) && (!_M0MPC15array5Array8containsGsE(["incomplete", "error", "failed"], _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "status"))) && !has_errors);
        const _p = true;
        const _bind$7 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "auditId", _1: _M0FP36cjyhjy10visionleak4core5field(value, "auditId") }, { _0: "images", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(images) }, { _0: "pairs", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(pairs) }, { _0: "complete", _1: _M0MPC14json4Json4JsonGbE(complete) }];
        const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$7, 0, 5), undefined);
        return new _M0DTPB4Json6Object(_p$2);
      } else {
        return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "报告必须包含 images 和 pairs 数组。");
      }
    } else {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "报告必须包含 images 和 pairs 数组。");
    }
  } else {
    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "报告 必须是对象。");
  }
}
function _M0FP36cjyhjy10visionleak4core23validate__review__value(value, report, dates) {
  if (value.$tag === 6) {
    if (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(value, "schemaVersion"), _M0MPC14json4Json4JsonGsE("visionleak-review-v1"))) {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "不支持的复核格式，需要 visionleak-review-v1。");
    }
    if (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(value, "auditId"), _M0FP36cjyhjy10visionleak4core5field(report, "auditId"))) {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "auditId 不匹配：复核记录属于另一份审计，未导入任何标记。");
    }
    const _bind = _M0FP36cjyhjy10visionleak4core5field(value, "reviews");
    if (_bind.$tag === 5) {
      const _Array = _bind;
      const _raw_reviews = _Array._0;
      _L: {
        if (dates.$tag === 5) {
          const _Array$2 = dates;
          const _timestamps = _Array$2._0;
          if (_timestamps.length === _raw_reviews.length) {
            const _bind$2 = [];
            const allowed = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$2, 0, 0), undefined);
            const _bind$3 = _M0FP36cjyhjy10visionleak4core5field(report, "pairs");
            if (_bind$3.$tag === 5) {
              const _Array$3 = _bind$3;
              const _pairs = _Array$3._0;
              const _bind$4 = _pairs.length;
              let _tmp = 0;
              while (true) {
                const _ = _tmp;
                if (_ < _bind$4) {
                  const pair = _pairs[_];
                  _M0MPB3Map3setGsbE(allowed, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "key")), true);
                  _tmp = _ + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
            }
            const _bind$4 = [];
            const seen = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$4, 0, 0), undefined);
            const reviews = [];
            let _tmp = 0;
            while (true) {
              const i = _tmp;
              if (i < _raw_reviews.length) {
                const raw = _M0MPC15array5Array2atGRPB4JsonE(_raw_reviews, i);
                if (raw.$tag === 6) {
                  const left = _M0FP36cjyhjy10visionleak4core5field(raw, "left");
                  const right = _M0FP36cjyhjy10visionleak4core5field(raw, "right");
                  if (!_M0FP36cjyhjy10visionleak4core8nonempty(left) || !_M0FP36cjyhjy10visionleak4core8nonempty(right)) {
                    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "left、right 必须是非空字符串。");
                  }
                  const key = _M0FP36cjyhjy10visionleak4core17review__pair__key(_M0FP36cjyhjy10visionleak4core4text(left), _M0FP36cjyhjy10visionleak4core4text(right));
                  if (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(raw, "pairKey"), _M0MPC14json4Json4JsonGsE(key)) || !_M0MPB3Map8containsGsbE(allowed, key)) {
                    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "证据对不匹配：复核记录包含当前报告之外或被修改的 pair key，未导入任何标记。");
                  }
                  if (_M0MPB3Map8containsGsbE(seen, key)) {
                    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "复核记录包含重复的证据对，未导入任何标记。");
                  }
                  if (!_M0FP36cjyhjy10visionleak4core15decision__known(_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(raw, "decision")))) {
                    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "人工标记只能是 confirmed、rejected 或 unsure。");
                  }
                  _L$2: {
                    _L$3: {
                      const _bind$5 = _M0FP36cjyhjy10visionleak4core5field(raw, "note");
                      if (_bind$5.$tag === 4) {
                        const _String = _bind$5;
                        const _note = _String._0;
                        if (_note.length <= 20000) {
                          let _tmp$2;
                          const _bind$6 = _M0FP36cjyhjy10visionleak4core5field(raw, "updatedAt");
                          let _tmp$3;
                          if (_bind$6.$tag === 4) {
                            _tmp$3 = true;
                          } else {
                            _tmp$3 = false;
                          }
                          if (!_tmp$3) {
                            _tmp$2 = true;
                          } else {
                            const _bind$7 = _M0MPC15array5Array2atGRPB4JsonE(_timestamps, i);
                            let _tmp$4;
                            if (_bind$7.$tag === 3) {
                              _tmp$4 = true;
                            } else {
                              _tmp$4 = false;
                            }
                            _tmp$2 = !_tmp$4;
                          }
                          if (_tmp$2) {
                            return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "人工标记的 updatedAt 时间格式无效。");
                          }
                          _M0MPB3Map3setGsbE(seen, key, true);
                          const _bind$7 = [{ _0: "pairKey", _1: _M0MPC14json4Json4JsonGsE(key) }, { _0: "left", _1: left }, { _0: "right", _1: right }, { _0: "decision", _1: _M0FP36cjyhjy10visionleak4core5field(raw, "decision") }, { _0: "note", _1: _M0MPC14json4Json4JsonGsE(_note) }, { _0: "updatedAt", _1: _M0FP36cjyhjy10visionleak4core5field(raw, "updatedAt") }];
                          const _p = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$7, 0, 6), undefined);
                          _M0MPC15array5Array4pushGsE(reviews, new _M0DTPB4Json6Object(_p));
                        } else {
                          break _L$3;
                        }
                      } else {
                        break _L$3;
                      }
                      break _L$2;
                    }
                    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "注释必须是 20,000 字符以内的文本。");
                  }
                } else {
                  return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "人工标记 必须是对象。");
                }
                _tmp = i + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            const _p = true;
            const _bind$5 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "reviews", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(reviews) }];
            const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$5, 0, 2), undefined);
            return new _M0DTPB4Json6Object(_p$2);
          } else {
            break _L;
          }
        } else {
          break _L;
        }
      }
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "人工标记的 updatedAt 时间格式无效。");
    } else {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "复核记录必须包含 reviews 数组。");
    }
  } else {
    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidReview", "复核记录 必须是对象。");
  }
}
function _M0FP36cjyhjy10visionleak4core24review__validation__json(source) {
  if (source.length > 67108864 || !_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 128)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ReviewBudget", "报告或复核记录超出大小或结构深度上限。"), false, 0, undefined);
  }
  let request;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        request = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidJson", "无效的报告或复核 JSON。"), false, 0, undefined);
  }
  const operation = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(request, "operation"));
  if (operation === "pairKey") {
    const left = _M0FP36cjyhjy10visionleak4core5field(request, "left");
    const right = _M0FP36cjyhjy10visionleak4core5field(request, "right");
    if (!_M0FP36cjyhjy10visionleak4core8nonempty(left) || !_M0FP36cjyhjy10visionleak4core8nonempty(right)) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidPair", "left、right 必须是非空字符串。"), false, 0, undefined);
    }
    const _p = true;
    const _bind = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "key", _1: _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core17review__pair__key(_M0FP36cjyhjy10visionleak4core4text(left), _M0FP36cjyhjy10visionleak4core4text(right))) }];
    const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 2), undefined);
    const result = new _M0DTPB4Json6Object(_p$2);
    return _M0MPC14json4Json17stringify_2einner(result, false, 0, undefined);
  }
  const report = _M0FP36cjyhjy10visionleak4core23validate__report__value(_M0FP36cjyhjy10visionleak4core5field(request, "report"));
  if (_M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(_M0FP36cjyhjy10visionleak4core5field(report, "ok"), _M0MPC14json4Json4JsonGbE(true)) || operation === "report") {
    return _M0MPC14json4Json17stringify_2einner(report, false, 0, undefined);
  }
  if (operation === "review") {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core23validate__review__value(_M0FP36cjyhjy10visionleak4core5field(request, "value"), report, _M0FP36cjyhjy10visionleak4core5field(request, "dates")), false, 0, undefined);
  }
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidOperation", "未知复核操作。"), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core15property__index(key) {
  let _tmp;
  if (key === "") {
    _tmp = true;
  } else {
    let _tmp$2;
    if (key.length > 10) {
      _tmp$2 = true;
    } else {
      let _tmp$3;
      if (key.length > 1) {
        const _p = 0 >>> 0 < key.length ? key.charCodeAt(0) : $oob();
        const _p$2 = 48;
        _tmp$3 = _p === _p$2;
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    }
    _tmp = _tmp$2;
  }
  if (_tmp) {
    return undefined;
  }
  let value = 0n;
  const _it = _M0MPC16string6String4iter(key);
  while (true) {
    const _bind = _M0MPB4Iter4nextGcE(_it);
    if (_bind === -1) {
      break;
    } else {
      const _Some = _bind;
      const _c = _Some;
      if (_c < 48 || _c > 57) {
        return undefined;
      }
      const _tmp$2 = BigInt.asUintN(64, value * 10n);
      const _p = _c - 48 | 0;
      value = BigInt.asUintN(64, _tmp$2 + BigInt.asUintN(64, BigInt(_p)));
      continue;
    }
  }
  return BigInt.asUintN(64, value) < BigInt.asUintN(64, 4294967295n) ? value : undefined;
}
function _M0FP36cjyhjy10visionleak4core15identity__write(value, canonical, top, out) {
  switch (value.$tag) {
    case 6: {
      const _Object = value;
      const _fields = _Object._0;
      const numeric = [];
      const keys = [];
      const _it = _M0MPB3Map5iter2GsRPB4JsonE(_fields);
      while (true) {
        const _bind = _M0MPB5Iter24nextGsRPB4JsonE(_it);
        if (_bind === undefined) {
          break;
        } else {
          const _Some = _bind;
          const _x = _Some;
          const _key = _x._0;
          if (top && _M0MPC15array5Array8containsGsE(["auditId", "createdAt", "timing", "review"], _key)) {
            continue;
          }
          const _bind$2 = _M0FP36cjyhjy10visionleak4core15property__index(_key);
          if (_bind$2 === undefined) {
            _M0MPC15array5Array4pushGsE(keys, _key);
          } else {
            const _Some$2 = _bind$2;
            const _index = _Some$2;
            _M0MPC15array5Array4pushGsE(numeric, { _0: _index, _1: _key });
          }
          continue;
        }
      }
      _M0MPC15array5Array13sort__by__keyGUmsEmE(numeric, (p) => p._0);
      if (canonical) {
        _M0MPC15array5Array8sort__byGsE(keys, (a, b) => _M0MPC16string6String16lexical__compare(a, b));
      }
      const _p = new Array(numeric.length);
      const _p$2 = numeric.length;
      let _tmp = 0;
      while (true) {
        const _p$3 = _tmp;
        if (_p$3 < _p$2) {
          const _p$4 = numeric[_p$3];
          _p[_p$3] = _p$4._1;
          _tmp = _p$3 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const ordered = _p;
      const _bind = keys.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind) {
          const key = keys[_];
          _M0MPC15array5Array4pushGsE(ordered, key);
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0IPB13StringBuilderPB6Logger13write__string(out, "{");
      let _tmp$3 = 0;
      while (true) {
        const i = _tmp$3;
        if (i < ordered.length) {
          if (i > 0) {
            _M0IPB13StringBuilderPB6Logger13write__string(out, ",");
          }
          const key = _M0MPC15array5Array2atGRPB4JsonE(ordered, i);
          _M0IPB13StringBuilderPB6Logger13write__string(out, _M0MPC14json4Json17stringify_2einner(_M0MPC14json4Json4JsonGsE(key), false, 0, undefined));
          _M0IPB13StringBuilderPB6Logger13write__string(out, ":");
          _M0FP36cjyhjy10visionleak4core15identity__write(_M0MPB3Map2atGsRPB4JsonE(_fields, key), canonical, false, out);
          _tmp$3 = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0IPB13StringBuilderPB6Logger13write__string(out, "}");
      return;
    }
    case 5: {
      const _Array = value;
      const _values = _Array._0;
      _M0IPB13StringBuilderPB6Logger13write__string(out, "[");
      let _tmp$4 = 0;
      while (true) {
        const i = _tmp$4;
        if (i < _values.length) {
          if (i > 0) {
            _M0IPB13StringBuilderPB6Logger13write__string(out, ",");
          }
          _M0FP36cjyhjy10visionleak4core15identity__write(_M0MPC15array5Array2atGRPB4JsonE(_values, i), canonical, false, out);
          _tmp$4 = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0IPB13StringBuilderPB6Logger13write__string(out, "]");
      return;
    }
    default: {
      _M0IPB13StringBuilderPB6Logger13write__string(out, _M0MPC14json4Json17stringify_2einner(value, false, 0, undefined));
      return;
    }
  }
}
function _M0FP36cjyhjy10visionleak4core22report__identity__json(source) {
  if (source.length > 67108864 || !_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 128)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ReportBudget", "报告超出大小或结构深度上限。"), false, 0, undefined);
  }
  let report;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        report = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "审计报告必须是有效 JSON。"), false, 0, undefined);
  }
  if (report.$tag === 6) {
    const version = _M0FP36cjyhjy10visionleak4core5field(report, "identityVersion");
    let _tmp;
    let _tmp$2;
    if (version.$tag === 0) {
      _tmp$2 = true;
    } else {
      _tmp$2 = false;
    }
    if (!_tmp$2) {
      _tmp = _M0IP016_24default__implPB2Eq10not__equalGRPB4JsonE(version, _M0MPC14json4Json4JsonGsE("vl-report-sha256-v2"));
    } else {
      _tmp = false;
    }
    if (_tmp) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("IdentityVersion", "不支持的审计内容摘要版本。"), false, 0, undefined);
    }
    const out = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    let _tmp$3;
    if (version.$tag === 0) {
      _tmp$3 = true;
    } else {
      _tmp$3 = false;
    }
    _M0FP36cjyhjy10visionleak4core15identity__write(report, !_tmp$3, true, out);
    const payload = out.val;
    const digest = _M0FP36cjyhjy10visionleak4core6sha256(_M0FPC28encoding4utf814encode_2einner(new _M0TPC16string10StringView(payload, 0, payload.length), false));
    const _p = true;
    const _bind = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "payload", _1: _M0MPC14json4Json4JsonGsE(payload) }, { _0: "digest", _1: _M0MPC14json4Json4JsonGsE(digest) }];
    const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 3), undefined);
    const result = new _M0DTPB4Json6Object(_p$2);
    return _M0MPC14json4Json17stringify_2einner(result, false, 0, undefined);
  } else {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidReport", "审计报告必须是对象。"), false, 0, undefined);
  }
}
function _M0FP36cjyhjy10visionleak4core18pixel__digest__new(width, height) {
  const valid = width > 0 && (height > 0 && (width <= 65535 && (height <= 65535 && width <= (100000000 / height | 0))));
  const hash = _M0FP36cjyhjy10visionleak4core11sha256__new();
  if (valid) {
    const prefix = $makebytes(11, 0);
    if (0 >>> 0 < prefix.length) {
      prefix[0] = 86;
    } else {
      $oob();
    }
    if (1 >>> 0 < prefix.length) {
      prefix[1] = 76;
    } else {
      $oob();
    }
    if (2 >>> 0 < prefix.length) {
      prefix[2] = 49;
    } else {
      $oob();
    }
    let _tmp = 0;
    while (true) {
      const k = _tmp;
      if (k < 4) {
        const _tmp$2 = 3 + k | 0;
        if (_tmp$2 >>> 0 < prefix.length) {
          prefix[_tmp$2] = width >> (Math.imul(3 - k | 0, 8) | 0) & 255;
        } else {
          $oob();
        }
        const _tmp$3 = 7 + k | 0;
        if (_tmp$3 >>> 0 < prefix.length) {
          prefix[_tmp$3] = height >> (Math.imul(3 - k | 0, 8) | 0) & 255;
        } else {
          $oob();
        }
        _tmp = k + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0FP36cjyhjy10visionleak4core14sha256__update(hash, _M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(prefix, 0, prefix.length)));
  }
  return new _M0TP36cjyhjy10visionleak4core16PixelDigestState(hash, width, height, BigInt.asUintN(64, BigInt.asUintN(64, BigInt(width)) * BigInt.asUintN(64, BigInt(height))), 0n, 255, 0, valid);
}
function _M0FP36cjyhjy10visionleak4core27pixel__digest__update__rgba(context, rgba) {
  _L: {
    _L$2: {
      if (!context.valid) {
        break _L$2;
      } else {
        if ((rgba.length % 4 | 0) !== 0) {
          break _L$2;
        } else {
          const _bind = context.hash.digest;
          if (_bind === undefined) {
          } else {
            break _L$2;
          }
        }
      }
      break _L;
    }
    context.valid = false;
    return false;
  }
  const count = rgba.length / 4 | 0;
  if (BigInt.asIntN(64, BigInt.asUintN(64, BigInt(count))) > BigInt.asIntN(64, BigInt.asUintN(64, context.expected - context.pixels))) {
    context.valid = false;
    return false;
  }
  const rgb = $makebytes(Math.imul(count, 3) | 0, 0);
  let _tmp = 0;
  while (true) {
    const p = _tmp;
    if (p < count) {
      const _tmp$2 = (Math.imul(p, 4) | 0) + 3 | 0;
      const alpha = _tmp$2 >>> 0 < rgba.length ? rgba[_tmp$2] : $oob();
      let _tmp$3 = 0;
      while (true) {
        const c = _tmp$3;
        if (c < 3) {
          const _tmp$4 = (Math.imul(p, 3) | 0) + c | 0;
          const _tmp$5 = (Math.imul(p, 4) | 0) + c | 0;
          if (_tmp$4 >>> 0 < rgb.length) {
            rgb[_tmp$4] = ((((Math.imul(_tmp$5 >>> 0 < rgba.length ? rgba[_tmp$5] : $oob(), alpha) | 0) + (Math.imul(255, 255 - alpha | 0) | 0) | 0) + 127 | 0) / 255 | 0) & 255;
          } else {
            $oob();
          }
          _tmp$3 = c + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = p + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let _tmp$2 = 0;
  while (true) {
    const p = _tmp$2;
    if (p < count) {
      const _tmp$3 = Math.imul(p, 3) | 0;
      const _tmp$4 = Math.imul(299, _tmp$3 >>> 0 < rgb.length ? rgb[_tmp$3] : $oob()) | 0;
      const _tmp$5 = (Math.imul(p, 3) | 0) + 1 | 0;
      const _tmp$6 = _tmp$4 + (Math.imul(587, _tmp$5 >>> 0 < rgb.length ? rgb[_tmp$5] : $oob()) | 0) | 0;
      const _tmp$7 = (Math.imul(p, 3) | 0) + 2 | 0;
      const luminance = ((_tmp$6 + (Math.imul(114, _tmp$7 >>> 0 < rgb.length ? rgb[_tmp$7] : $oob()) | 0) | 0) + 500 | 0) / 1000 | 0;
      const _p = context.low;
      context.low = _p < luminance ? _p : luminance;
      const _p$2 = context.high;
      context.high = _p$2 > luminance ? _p$2 : luminance;
      _tmp$2 = p + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  context.pixels = BigInt.asUintN(64, context.pixels + BigInt.asUintN(64, BigInt(count)));
  return _M0FP36cjyhjy10visionleak4core14sha256__update(context.hash, _M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(rgb, 0, rgb.length)));
}
function _M0FP36cjyhjy10visionleak4core20pixel__digest__final(context) {
  if (!context.valid || BigInt.asUintN(64, context.pixels) !== BigInt.asUintN(64, context.expected)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidPixels", "Full-resolution pixel stream has invalid dimensions or length"), false, 0, undefined);
  }
  const _p = true;
  const _tmp = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$2 = { _0: "width", _1: _M0MPC14json4Json4JsonGiE(context.width) };
  const _tmp$3 = { _0: "height", _1: _M0MPC14json4Json4JsonGiE(context.height) };
  const _tmp$4 = { _0: "pixelDigest", _1: _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core13sha256__final(context.hash)) };
  const _p$2 = "vl-rgb-v1";
  const _bind = [_tmp, _tmp$2, _tmp$3, _tmp$4, { _0: "normalization", _1: new _M0DTPB4Json6String(_p$2) }, { _0: "contrast", _1: _M0MPC14json4Json4JsonGiE(context.high - context.low | 0) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 6), undefined);
  const result = new _M0DTPB4Json6Object(_p$3);
  return _M0MPC14json4Json17stringify_2einner(result, false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core8mih__new() {
  const _bind = [];
  return new _M0TP36cjyhjy10visionleak4core8MihIndex(_M0MPB3Map3MapGiRPB5ArrayGiEE(new _M0TPB9ArrayViewGUiRPB5ArrayGiEEE(_bind, 0, 0), undefined), []);
}
function _M0FP36cjyhjy10visionleak4core13hash__segment(hash, part) {
  const word = part < 2 ? hash.high : hash.low;
  return word >>> (Math.imul(part % 2 | 0, 16) | 0) & 65535;
}
function _M0FP36cjyhjy10visionleak4core11mih__insert(index, hash, parent) {
  const id = index.parents.length;
  _M0MPC15array5Array4pushGiE(index.parents, parent);
  let _tmp = 0;
  while (true) {
    const part = _tmp;
    if (part < 4) {
      const key = (Math.imul(part, 65536) | 0) + _M0FP36cjyhjy10visionleak4core13hash__segment(hash, part) | 0;
      const _bind = _M0MPB3Map3getGiRPB5ArrayGiEE(index.buckets, key);
      if (_bind.$tag === 1) {
        const _Some = _bind;
        const _ids = _Some._0;
        _M0MPC15array5Array4pushGiE(_ids, id);
      } else {
        _M0MPB3Map3setGiRPB5ArrayGiEE(index.buckets, key, [id]);
      }
      _tmp = part + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0MP36cjyhjy10visionleak4core6Budget11take__index(self) {
  if (self.index_work >= (Math.imul(self.maximum, 16) | 0)) {
    self.reason = "IndexBudget";
    return false;
  } else {
    self.index_work = self.index_work + 1 | 0;
    return true;
  }
}
function _M0FP36cjyhjy10visionleak4core10mih__paths(index, hash, threshold, budget) {
  if (threshold > 7 || index.parents.length < 128) {
    return undefined;
  }
  const _bind = [];
  const paths = _M0MPB3Map3MapGibE(new _M0TPB9ArrayViewGUibEE(_bind, 0, 0), undefined);
  let _tmp = 0;
  while (true) {
    const part = _tmp;
    if (part < 4) {
      const segment = _M0FP36cjyhjy10visionleak4core13hash__segment(hash, part);
      const probes = threshold < 4 ? 1 : 17;
      let _tmp$2 = 0;
      while (true) {
        const probe = _tmp$2;
        if (probe < probes) {
          if (!_M0MP36cjyhjy10visionleak4core6Budget11take__index(budget)) {
            return paths;
          }
          const mask = probe === 0 ? 0 : 1 << (probe - 1 | 0);
          const key = (Math.imul(part, 65536) | 0) + (segment ^ mask) | 0;
          const _bind$2 = _M0MPB3Map3getGiRPB5ArrayGiEE(index.buckets, key);
          if (_bind$2.$tag === 1) {
            const _Some = _bind$2;
            const _ids = _Some._0;
            const _bind$3 = _ids.length;
            let _tmp$3 = 0;
            while (true) {
              const _ = _tmp$3;
              if (_ < _bind$3) {
                const id = _ids[_];
                if (!_M0MP36cjyhjy10visionleak4core6Budget11take__index(budget)) {
                  return paths;
                }
                let cursor = id;
                while (true) {
                  if (cursor >= 0 && !_M0MPB3Map8containsGibE(paths, cursor)) {
                    if (!_M0MP36cjyhjy10visionleak4core6Budget11take__index(budget)) {
                      return paths;
                    }
                    _M0MPB3Map3setGibE(paths, cursor, true);
                    cursor = _M0MPC15array5Array2atGiE(index.parents, cursor);
                    continue;
                  } else {
                    break;
                  }
                }
                _tmp$3 = _ + 1 | 0;
                continue;
              } else {
                break;
              }
            }
          }
          _tmp$2 = probe + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = part + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return paths;
}
function _M0FP36cjyhjy10visionleak4core13mih__contains(paths, id) {
  if (paths === undefined) {
    return true;
  } else {
    const _Some = paths;
    const _values = _Some;
    return _M0MPB3Map8containsGibE(_values, id);
  }
}
function _M0FP36cjyhjy10visionleak4core19metric__pair__array(keys, pairs) {
  const sorted = _M0MPC15array5Array4copyGsE(keys);
  _M0MPC15array5Array8sort__byGsE(sorted, (a, b) => {
    const aa = _M0MPB3Map2atGsRPB4JsonE(pairs, a);
    const bb = _M0MPB3Map2atGsRPB4JsonE(pairs, b);
    _L: {
      if (aa.$tag === 5) {
        const _Array = aa;
        const _av = _Array._0;
        if (bb.$tag === 5) {
          const _Array$2 = bb;
          const _bv = _Array$2._0;
          const first = _M0MPC16string6String16lexical__compare(_M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_av, 0)), _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_bv, 0)));
          return first === 0 ? _M0MPC16string6String16lexical__compare(_M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_av, 1)), _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_bv, 1))) : first;
        } else {
          break _L;
        }
      } else {
        break _L;
      }
    }
    return _M0MPC16string6String16lexical__compare(a, b);
  });
  const _p = new Array(sorted.length);
  const _p$2 = sorted.length;
  let _tmp = 0;
  while (true) {
    const _p$3 = _tmp;
    if (_p$3 < _p$2) {
      const _p$4 = sorted[_p$3];
      _p[_p$3] = _M0MPB3Map2atGsRPB4JsonE(pairs, _p$4);
      _tmp = _p$3 + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(_p);
}
function _M0FP36cjyhjy10visionleak4core13metric__ratio(numerator, denominator) {
  return denominator === 0 ? _M0DTPB4Json4Null__ : _M0MPC14json4Json4JsonGdE((numerator + 0) / (denominator + 0));
}
function _M0FP36cjyhjy10visionleak4core14metric__counts(universe, positive, predicted, pairs) {
  let tp = 0;
  let tn = 0;
  const fp = [];
  const fn_pairs = [];
  const _bind = universe.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const key = universe[_];
      if (_M0MPB3Map8containsGsbE(positive, key)) {
        if (_M0MPB3Map8containsGsbE(predicted, key)) {
          tp = tp + 1 | 0;
        } else {
          _M0MPC15array5Array4pushGsE(fn_pairs, key);
        }
      } else {
        if (_M0MPB3Map8containsGsbE(predicted, key)) {
          _M0MPC15array5Array4pushGsE(fp, key);
        } else {
          tn = tn + 1 | 0;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$2 = [{ _0: "tp", _1: _M0MPC14json4Json4JsonGiE(tp) }, { _0: "fp", _1: _M0MPC14json4Json4JsonGiE(fp.length) }, { _0: "fn", _1: _M0MPC14json4Json4JsonGiE(fn_pairs.length) }, { _0: "tn", _1: _M0MPC14json4Json4JsonGiE(tn) }, { _0: "precision", _1: _M0FP36cjyhjy10visionleak4core13metric__ratio(tp, tp + fp.length | 0) }, { _0: "recall", _1: _M0FP36cjyhjy10visionleak4core13metric__ratio(tp, tp + fn_pairs.length | 0) }, { _0: "falsePositiveRate", _1: _M0FP36cjyhjy10visionleak4core13metric__ratio(fp.length, fp.length + tn | 0) }, { _0: "falsePositives", _1: _M0FP36cjyhjy10visionleak4core19metric__pair__array(fp, pairs) }, { _0: "falseNegatives", _1: _M0FP36cjyhjy10visionleak4core19metric__pair__array(fn_pairs, pairs) }];
  const _p = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 9), undefined);
  return new _M0DTPB4Json6Object(_p);
}
function _M0FP36cjyhjy10visionleak4core12score__value(truth, predictions) {
  const _bind = _M0FP36cjyhjy10visionleak4core5field(truth, "pairs");
  if (_bind.$tag === 5) {
    const _Array = _bind;
    const _truth_pairs = _Array._0;
    if (predictions.$tag === 5) {
      const _Array$2 = predictions;
      const _output = _Array$2._0;
      const _bind$2 = [];
      const labels = _M0MPB3Map3MapGssE(new _M0TPB9ArrayViewGUssEE(_bind$2, 0, 0), undefined);
      const _bind$3 = [];
      const pairs = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 0), undefined);
      const _bind$4 = [];
      const exact = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$4, 0, 0), undefined);
      const _bind$5 = [];
      const near = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$5, 0, 0), undefined);
      const _bind$6 = [];
      const near_predictions = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$6, 0, 0), undefined);
      const _bind$7 = [];
      const exact_predictions = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$7, 0, 0), undefined);
      const wrong_tier = [];
      const _bind$8 = [];
      const challenges = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$8, 0, 0), undefined);
      const _bind$9 = _M0FP36cjyhjy10visionleak4core5field(truth, "images");
      if (_bind$9.$tag === 5) {
        const _Array$3 = _bind$9;
        const _images = _Array$3._0;
        const _bind$10 = _images.length;
        let _tmp = 0;
        while (true) {
          const _ = _tmp;
          if (_ < _bind$10) {
            const image = _images[_];
            if (_M0MPC16string6String11has__prefix(_M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "transform")), new _M0TPC16string10StringView(_M0FP36cjyhjy10visionleak4core12score__valueN7_2abindS3565, 0, _M0FP36cjyhjy10visionleak4core12score__valueN7_2abindS3565.length))) {
              _M0MPB3Map3setGsbE(challenges, _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(image, "id")), true);
            }
            _tmp = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
      }
      const _bind$10 = _truth_pairs.length;
      let _tmp = 0;
      while (true) {
        const _ = _tmp;
        if (_ < _bind$10) {
          const pair = _truth_pairs[_];
          const a = _M0FP36cjyhjy10visionleak4core5field(pair, "left");
          const b = _M0FP36cjyhjy10visionleak4core5field(pair, "right");
          const relation = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "relation"));
          if (!_M0FP36cjyhjy10visionleak4core8nonempty(a) || (!_M0FP36cjyhjy10visionleak4core8nonempty(b) || !_M0MPC15array5Array8containsGsE(["byte-identical", "pixel-identical", "near-source", "negative"], relation))) {
            return _M0FP36cjyhjy10visionleak4core11error__json("InvalidTruth", "Invalid pair identifiers or truth relation");
          }
          const key = _M0FP36cjyhjy10visionleak4core17review__pair__key(_M0FP36cjyhjy10visionleak4core4text(a), _M0FP36cjyhjy10visionleak4core4text(b));
          if (_M0MPB3Map8containsGssE(labels, key)) {
            return _M0FP36cjyhjy10visionleak4core11error__json("InvalidTruth", "Duplicate truth pair");
          }
          _M0MPB3Map3setGssE(labels, key, relation);
          const ids = [_M0FP36cjyhjy10visionleak4core4text(a), _M0FP36cjyhjy10visionleak4core4text(b)];
          _M0MPC15array5Array8sort__byGsE(ids, (a$2, b$2) => _M0MPC16string6String16lexical__compare(a$2, b$2));
          _M0MPB3Map3setGsRPB4JsonE(pairs, key, _M0MPC14json4Json4JsonGRPB5ArrayGsEE(ids));
          if (relation === "byte-identical" || relation === "pixel-identical") {
            _M0MPB3Map3setGsbE(exact, key, true);
          }
          if (relation === "near-source") {
            _M0MPB3Map3setGsbE(near, key, true);
          }
          _tmp = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$11 = _output.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind$11) {
          const pair = _output[_];
          const a = _M0FP36cjyhjy10visionleak4core5field(pair, "left");
          const b = _M0FP36cjyhjy10visionleak4core5field(pair, "right");
          const evidence = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(pair, "evidence"));
          if (!_M0FP36cjyhjy10visionleak4core8nonempty(a) || (!_M0FP36cjyhjy10visionleak4core8nonempty(b) || !_M0FP36cjyhjy10visionleak4core15evidence__known(evidence))) {
            return _M0FP36cjyhjy10visionleak4core11error__json("InvalidPredictions", "Invalid prediction identifiers or evidence");
          }
          const key = _M0FP36cjyhjy10visionleak4core17review__pair__key(_M0FP36cjyhjy10visionleak4core4text(a), _M0FP36cjyhjy10visionleak4core4text(b));
          if (!_M0MPB3Map8containsGssE(labels, key)) {
            return _M0FP36cjyhjy10visionleak4core11error__json("UnknownPair", "Audit emitted unknown or same-split pairs");
          }
          if (evidence === "byte-identical" || evidence === "pixel-identical") {
            _M0MPB3Map3setGsbE(exact_predictions, key, true);
            const _p = _M0MPB3Map2atGssE(labels, key);
            if (!(_p === evidence)) {
              _M0MPC15array5Array4pushGsE(wrong_tier, pair);
            }
          } else {
            _M0MPB3Map3setGsbE(near_predictions, key, true);
          }
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const all = [];
      const near_universe = [];
      const challenge_universe = [];
      const common_universe = [];
      let candidate_on_exact = 0;
      const _it = _M0MPB3Map5iter2GsRPB4JsonE(labels);
      while (true) {
        const _bind$12 = _M0MPB5Iter24nextGsRPB4JsonE(_it);
        if (_bind$12 === undefined) {
          break;
        } else {
          const _Some = _bind$12;
          const _x = _Some;
          const _key = _x._0;
          _M0MPC15array5Array4pushGsE(all, _key);
          if (_M0MPB3Map8containsGsbE(exact, _key)) {
            if (_M0MPB3Map8containsGsbE(near_predictions, _key)) {
              candidate_on_exact = candidate_on_exact + 1 | 0;
            }
            continue;
          }
          _M0MPC15array5Array4pushGsE(near_universe, _key);
          const _bind$13 = _M0MPB3Map2atGsRPB4JsonE(pairs, _key);
          if (_bind$13.$tag === 5) {
            const _Array$3 = _bind$13;
            const _ids = _Array$3._0;
            if (_M0MPB3Map8containsGsbE(challenges, _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_ids, 0))) || _M0MPB3Map8containsGsbE(challenges, _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_ids, 1)))) {
              _M0MPC15array5Array4pushGsE(challenge_universe, _key);
            } else {
              _M0MPC15array5Array4pushGsE(common_universe, _key);
            }
          }
          continue;
        }
      }
      const _bind$12 = [{ _0: "exact", _1: _M0FP36cjyhjy10visionleak4core14metric__counts(all, exact, exact_predictions, pairs) }, { _0: "nearOnly", _1: _M0FP36cjyhjy10visionleak4core14metric__counts(near_universe, near, near_predictions, pairs) }, { _0: "nearCommonTransforms", _1: _M0FP36cjyhjy10visionleak4core14metric__counts(common_universe, near, near_predictions, pairs) }, { _0: "nearChallengeTransforms", _1: _M0FP36cjyhjy10visionleak4core14metric__counts(challenge_universe, near, near_predictions, pairs) }, { _0: "exactEvidenceTierMismatches", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(wrong_tier) }, { _0: "exactPairsEmittedAsCandidates", _1: _M0MPC14json4Json4JsonGiE(candidate_on_exact) }, { _0: "pairUniverse", _1: _M0MPC14json4Json4JsonGiE(all.length) }, { _0: "nearOnlyUniverse", _1: _M0MPC14json4Json4JsonGiE(near_universe.length) }];
      const _p = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$12, 0, 8), undefined);
      const scores = new _M0DTPB4Json6Object(_p);
      const _p$2 = true;
      const _bind$13 = [{ _0: "ok", _1: _p$2 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "scores", _1: scores }];
      const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$13, 0, 2), undefined);
      return new _M0DTPB4Json6Object(_p$3);
    } else {
      return _M0FP36cjyhjy10visionleak4core11error__json("InvalidPredictions", "Predictions must be an array");
    }
  } else {
    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidTruth", "Truth must contain pairs");
  }
}
function _M0FP36cjyhjy10visionleak4core11score__json(source) {
  if (source.length > 67108864 || !_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 16)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("MetricBudget", "Scoring input exceeds its bounded budget"), false, 0, undefined);
  }
  let request;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        request = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidJson", "Scoring requires valid JSON"), false, 0, undefined);
  }
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core12score__value(_M0FP36cjyhjy10visionleak4core5field(request, "truth"), _M0FP36cjyhjy10visionleak4core5field(request, "pairs")), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core6bits64(s) {
  if (s.length !== 64) {
    return false;
  }
  const _it = _M0MPC16string6String4iter(s);
  while (true) {
    const _bind = _M0MPB4Iter4nextGcE(_it);
    if (_bind === -1) {
      break;
    } else {
      const _Some = _bind;
      const _c = _Some;
      if (_c !== 48 && _c !== 49) {
        return false;
      }
      continue;
    }
  }
  return true;
}
function _M0FP36cjyhjy10visionleak4core10grid__hash(grid) {
  const bits = _M0MPB13StringBuilder21StringBuilder_2einner(0);
  let _tmp = 0;
  while (true) {
    const y = _tmp;
    if (y < 8) {
      let _tmp$2 = 0;
      while (true) {
        const x = _tmp$2;
        if (x < 8) {
          _M0IPB13StringBuilderPB6Logger13write__string(bits, _M0MPC15array5Array2atGiE(grid, ((Math.imul(y, 9) | 0) + x | 0) + 1 | 0) > _M0MPC15array5Array2atGiE(grid, (Math.imul(y, 9) | 0) + x | 0) ? "1" : "0");
          _tmp$2 = x + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = y + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return bits.val;
}
function _M0FP36cjyhjy10visionleak4core13crop__windows() {
  const rows = [[0, 0, 1000, 1000]];
  const _bind = [900, 750, 500];
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const side = _bind[_];
      const gap = 1000 - side | 0;
      const _bind$3 = [_M0FP36cjyhjy10visionleak4core13crop__windowsN5tupleS3647, { _0: gap, _1: 0 }, { _0: 0, _1: gap }, { _0: gap, _1: gap }, { _0: gap / 2 | 0, _1: gap / 2 | 0 }];
      const _bind$4 = _bind$3.length;
      let _tmp$2 = 0;
      while (true) {
        const _$2 = _tmp$2;
        if (_$2 < _bind$4) {
          const _foreach_element = _bind$3[_$2];
          const _x = _foreach_element._0;
          const _y = _foreach_element._1;
          _M0MPC15array5Array4pushGRPB5ArrayGiEE(rows, [_x, _y, _x + side | 0, _y + side | 0]);
          _tmp$2 = _$2 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$3 = [[0, 0, 750, 1000], [250, 0, 1000, 1000], [0, 0, 1000, 750], [0, 250, 1000, 1000]];
  const _bind$4 = _bind$3.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$4) {
      const row = _bind$3[_];
      _M0MPC15array5Array4pushGRPB5ArrayGiEE(rows, row);
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return rows;
}
function _M0FP36cjyhjy10visionleak4core18local__fingerprint(width, height, sums) {
  const stride = width + 1 | 0;
  const hashes = [];
  const contrasts = [];
  const _bind = _M0FP36cjyhjy10visionleak4core13crop__windows();
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const rect = _bind[_];
      const left = (Math.imul(_M0MPC15array5Array2atGiE(rect, 0), width) | 0) / 1000 | 0;
      const top = (Math.imul(_M0MPC15array5Array2atGiE(rect, 1), height) | 0) / 1000 | 0;
      const _p = left + 1 | 0;
      const _p$2 = (Math.imul(_M0MPC15array5Array2atGiE(rect, 2), width) | 0) / 1000 | 0;
      const right = _p > _p$2 ? _p : _p$2;
      const _p$3 = top + 1 | 0;
      const _p$4 = (Math.imul(_M0MPC15array5Array2atGiE(rect, 3), height) | 0) / 1000 | 0;
      const bottom = _p$3 > _p$4 ? _p$3 : _p$4;
      const w = right - left | 0;
      const h = bottom - top | 0;
      const grid = _M0MPC15array5Array4makeGiE(72, 0);
      let lo = 255;
      let hi = 0;
      let _tmp$2 = 0;
      while (true) {
        const y = _tmp$2;
        if (y < 8) {
          const y0 = top + ((Math.imul(y, h) | 0) / 8 | 0) | 0;
          const _p$5 = y0 + 1 | 0;
          const _p$6 = top + ((Math.imul(y + 1 | 0, h) | 0) / 8 | 0) | 0;
          const _p$7 = _p$5 > _p$6 ? _p$5 : _p$6;
          const y1 = bottom < _p$7 ? bottom : _p$7;
          let _tmp$3 = 0;
          while (true) {
            const x = _tmp$3;
            if (x < 9) {
              const x0 = left + ((Math.imul(x, w) | 0) / 9 | 0) | 0;
              const _p$8 = x0 + 1 | 0;
              const _p$9 = left + ((Math.imul(x + 1 | 0, w) | 0) / 9 | 0) | 0;
              const _p$10 = _p$8 > _p$9 ? _p$8 : _p$9;
              const x1 = right < _p$10 ? right : _p$10;
              const _tmp$4 = (Math.imul(y1, stride) | 0) + x1 | 0;
              const _tmp$5 = _tmp$4 >>> 0 < sums.length ? sums[_tmp$4] : $oob();
              const _tmp$6 = (Math.imul(y0, stride) | 0) + x1 | 0;
              const _tmp$7 = _tmp$5 - (_tmp$6 >>> 0 < sums.length ? sums[_tmp$6] : $oob()) | 0;
              const _tmp$8 = (Math.imul(y1, stride) | 0) + x0 | 0;
              const _tmp$9 = _tmp$7 - (_tmp$8 >>> 0 < sums.length ? sums[_tmp$8] : $oob()) | 0;
              const _tmp$10 = (Math.imul(y0, stride) | 0) + x0 | 0;
              const total = _tmp$9 + (_tmp$10 >>> 0 < sums.length ? sums[_tmp$10] : $oob()) | 0;
              const mean = total / (Math.imul(x1 - x0 | 0, y1 - y0 | 0) | 0) | 0;
              _M0MPC15array5Array3setGiE(grid, (Math.imul(y, 9) | 0) + x | 0, mean);
              const _p$11 = lo;
              lo = _p$11 < mean ? _p$11 : mean;
              const _p$12 = hi;
              hi = _p$12 > mean ? _p$12 : mean;
              _tmp$3 = x + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$2 = y + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0MPC15array5Array4pushGsE(hashes, _M0FP36cjyhjy10visionleak4core10grid__hash(grid));
      _M0MPC15array5Array4pushGiE(contrasts, hi - lo | 0);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _tmp$2 = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$3 = { _0: "localHashes", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(hashes) };
  const _tmp$4 = { _0: "localContrasts", _1: _M0MPC14json4Json4JsonGRPB5ArrayGiEE(contrasts) };
  const _p$2 = "vl-local-dhash-v1";
  const _bind$3 = [_tmp$2, _tmp$3, _tmp$4, { _0: "localHashVersion", _1: new _M0DTPB4Json6String(_p$2) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 4), undefined);
  return new _M0DTPB4Json6Object(_p$3);
}
function _M0FP36cjyhjy10visionleak4core14oriented__hash(gray, width, height, turns, mirror) {
  const w = turns === 2 ? width : height;
  const h = turns === 2 ? height : width;
  const grid = _M0MPC15array5Array4makeGiE(72, 0);
  let _tmp = 0;
  while (true) {
    const y = _tmp;
    if (y < 8) {
      const y0 = (Math.imul(y, h) | 0) / 8 | 0;
      const _p = y0 + 1 | 0;
      const _p$2 = (Math.imul(y + 1 | 0, h) | 0) / 8 | 0;
      const y1 = _p > _p$2 ? _p : _p$2;
      let _tmp$2 = 0;
      while (true) {
        const x = _tmp$2;
        if (x < 9) {
          const x0 = (Math.imul(x, w) | 0) / 9 | 0;
          const _p$3 = x0 + 1 | 0;
          const _p$4 = (Math.imul(x + 1 | 0, w) | 0) / 9 | 0;
          const x1 = _p$3 > _p$4 ? _p$3 : _p$4;
          let sum = 0n;
          let _tmp$3 = y0;
          while (true) {
            const yy = _tmp$3;
            if (yy < y1) {
              let _tmp$4 = x0;
              while (true) {
                const xx = _tmp$4;
                if (xx < x1) {
                  const rx = mirror ? (w - 1 | 0) - xx | 0 : xx;
                  let sx;
                  let sy;
                  _L: {
                    switch (turns) {
                      case 1: {
                        sx = yy;
                        sy = (height - 1 | 0) - rx | 0;
                        break _L;
                      }
                      case 2: {
                        sx = (width - 1 | 0) - rx | 0;
                        sy = (height - 1 | 0) - yy | 0;
                        break _L;
                      }
                      default: {
                        sx = (width - 1 | 0) - yy | 0;
                        sy = rx;
                        break _L;
                      }
                    }
                  }
                  const _tmp$5 = sum;
                  const _tmp$6 = (Math.imul(sy, width) | 0) + sx | 0;
                  const _p$5 = _tmp$6 >>> 0 < gray.length ? gray[_tmp$6] : $oob();
                  sum = BigInt.asUintN(64, _tmp$5 + BigInt.asUintN(64, BigInt(_p$5)));
                  _tmp$4 = xx + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              _tmp$3 = yy + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const _tmp$4 = (Math.imul(y, 9) | 0) + x | 0;
          const _tmp$5 = BigInt.asUintN(64, BigInt(Math.imul(x1 - x0 | 0, y1 - y0 | 0) | 0));
          if (_tmp$5 === 0n) {
            $panic();
          }
          _M0MPC15array5Array3setGiE(grid, _tmp$4, Number(BigInt.asIntN(32, BigInt.asUintN(64, BigInt.asIntN(64, sum) / BigInt.asIntN(64, _tmp$5)))) | 0);
          _tmp$2 = x + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = y + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0FP36cjyhjy10visionleak4core10grid__hash(grid);
}
function _M0FP36cjyhjy10visionleak4core17fingerprint__impl(width, height, rgba, mirrors, rotations, crops) {
  if (width <= 0 || (height <= 0 || (width > 65535 || (height > 65535 || width > (4194304 / height | 0))))) {
    return _M0FP36cjyhjy10visionleak4core11error__json("PixelBudget", "dimensions must fit 4194304 pixels and 65535 per side");
  }
  const count = Math.imul(width, height) | 0;
  if (rgba.length !== (Math.imul(count, 4) | 0)) {
    return _M0FP36cjyhjy10visionleak4core11error__json("InvalidPixels", "RGBA byte length does not match dimensions");
  }
  const digest = _M0FP36cjyhjy10visionleak4core18pixel__digest__new(width, height);
  const rgb = $makebytes(12288, 0);
  let used = 0;
  const gray = $makebytes(count, 0);
  const stride = width + 1 | 0;
  const sums = crops ? $make_array_len_and_init(Math.imul(stride, height + 1 | 0) | 0, 0) : $make_array_len_and_init(0, 0);
  let row_sum = 0;
  let lo = 255;
  let hi = 0;
  let _tmp = 0;
  while (true) {
    const p = _tmp;
    if (p < count) {
      const _tmp$2 = (Math.imul(p, 4) | 0) + 3 | 0;
      const alpha = _tmp$2 >>> 0 < rgba.length ? rgba[_tmp$2] : $oob();
      const _tmp$3 = Math.imul(p, 4) | 0;
      const r = (((Math.imul(_tmp$3 >>> 0 < rgba.length ? rgba[_tmp$3] : $oob(), alpha) | 0) + (Math.imul(255, 255 - alpha | 0) | 0) | 0) + 127 | 0) / 255 | 0;
      const _tmp$4 = (Math.imul(p, 4) | 0) + 1 | 0;
      const g = (((Math.imul(_tmp$4 >>> 0 < rgba.length ? rgba[_tmp$4] : $oob(), alpha) | 0) + (Math.imul(255, 255 - alpha | 0) | 0) | 0) + 127 | 0) / 255 | 0;
      const _tmp$5 = (Math.imul(p, 4) | 0) + 2 | 0;
      const b = (((Math.imul(_tmp$5 >>> 0 < rgba.length ? rgba[_tmp$5] : $oob(), alpha) | 0) + (Math.imul(255, 255 - alpha | 0) | 0) | 0) + 127 | 0) / 255 | 0;
      const _tmp$6 = used;
      if (_tmp$6 >>> 0 < rgb.length) {
        rgb[_tmp$6] = r & 255;
      } else {
        $oob();
      }
      const _tmp$7 = used + 1 | 0;
      if (_tmp$7 >>> 0 < rgb.length) {
        rgb[_tmp$7] = g & 255;
      } else {
        $oob();
      }
      const _tmp$8 = used + 2 | 0;
      if (_tmp$8 >>> 0 < rgb.length) {
        rgb[_tmp$8] = b & 255;
      } else {
        $oob();
      }
      used = used + 3 | 0;
      if (used === rgb.length || p === (count - 1 | 0)) {
        _M0FP36cjyhjy10visionleak4core14sha256__update(digest.hash, _M0MPC15bytes5Bytes11from__array(_M0MPC15array10FixedArray21clamped__view_2einnerGyE(rgb, 0, used)));
        used = 0;
      }
      const luminance = ((((Math.imul(299, r) | 0) + (Math.imul(587, g) | 0) | 0) + (Math.imul(114, b) | 0) | 0) + 500 | 0) / 1000 | 0;
      if (p >>> 0 < gray.length) {
        gray[p] = luminance & 255;
      } else {
        $oob();
      }
      if (crops) {
        const x = p % width | 0;
        const y = p / width | 0;
        if (x === 0) {
          row_sum = 0;
        }
        row_sum = row_sum + luminance | 0;
        const _tmp$9 = ((Math.imul(y + 1 | 0, stride) | 0) + x | 0) + 1 | 0;
        const _tmp$10 = ((Math.imul(y, stride) | 0) + x | 0) + 1 | 0;
        if (_tmp$9 >>> 0 < sums.length) {
          sums[_tmp$9] = (_tmp$10 >>> 0 < sums.length ? sums[_tmp$10] : $oob()) + row_sum | 0;
        } else {
          $oob();
        }
      }
      if (luminance < lo) {
        lo = luminance;
      }
      if (luminance > hi) {
        hi = luminance;
      }
      _tmp = p + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const grid = _M0MPC15array5Array4makeGiE(72, 0);
  const mirror_grid = mirrors ? _M0MPC15array5Array4makeGiE(72, 0) : [];
  let _tmp$2 = 0;
  while (true) {
    const y = _tmp$2;
    if (y < 8) {
      const y0 = (Math.imul(y, height) | 0) / 8 | 0;
      const _p = y0 + 1 | 0;
      const _p$2 = (Math.imul(y + 1 | 0, height) | 0) / 8 | 0;
      const y1 = _p > _p$2 ? _p : _p$2;
      let _tmp$3 = 0;
      while (true) {
        const x = _tmp$3;
        if (x < 9) {
          const x0 = (Math.imul(x, width) | 0) / 9 | 0;
          const _p$3 = x0 + 1 | 0;
          const _p$4 = (Math.imul(x + 1 | 0, width) | 0) / 9 | 0;
          const x1 = _p$3 > _p$4 ? _p$3 : _p$4;
          let sum = 0n;
          let mirror_sum = 0n;
          let _tmp$4 = y0;
          while (true) {
            const yy = _tmp$4;
            if (yy < y1) {
              let _tmp$5 = x0;
              while (true) {
                const xx = _tmp$5;
                if (xx < x1) {
                  const _tmp$6 = sum;
                  const _tmp$7 = (Math.imul(yy, width) | 0) + xx | 0;
                  const _p$5 = _tmp$7 >>> 0 < gray.length ? gray[_tmp$7] : $oob();
                  sum = BigInt.asUintN(64, _tmp$6 + BigInt.asUintN(64, BigInt(_p$5)));
                  if (mirrors) {
                    const _tmp$8 = mirror_sum;
                    const _tmp$9 = (((Math.imul(yy, width) | 0) + width | 0) - 1 | 0) - xx | 0;
                    const _p$6 = _tmp$9 >>> 0 < gray.length ? gray[_tmp$9] : $oob();
                    mirror_sum = BigInt.asUintN(64, _tmp$8 + BigInt.asUintN(64, BigInt(_p$6)));
                  }
                  _tmp$5 = xx + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              _tmp$4 = yy + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const _tmp$5 = (Math.imul(y, 9) | 0) + x | 0;
          const _tmp$6 = BigInt.asUintN(64, BigInt(Math.imul(x1 - x0 | 0, y1 - y0 | 0) | 0));
          if (_tmp$6 === 0n) {
            $panic();
          }
          _M0MPC15array5Array3setGiE(grid, _tmp$5, Number(BigInt.asIntN(32, BigInt.asUintN(64, BigInt.asIntN(64, sum) / BigInt.asIntN(64, _tmp$6)))) | 0);
          if (mirrors) {
            const _tmp$7 = (Math.imul(y, 9) | 0) + x | 0;
            const _tmp$8 = BigInt.asUintN(64, BigInt(Math.imul(x1 - x0 | 0, y1 - y0 | 0) | 0));
            if (_tmp$8 === 0n) {
              $panic();
            }
            _M0MPC15array5Array3setGiE(mirror_grid, _tmp$7, Number(BigInt.asIntN(32, BigInt.asUintN(64, BigInt.asIntN(64, mirror_sum) / BigInt.asIntN(64, _tmp$8)))) | 0);
          }
          _tmp$3 = x + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp$2 = y + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _tmp$3 = { _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$4 = { _0: "width", _1: _M0MPC14json4Json4JsonGiE(width) };
  const _tmp$5 = { _0: "height", _1: _M0MPC14json4Json4JsonGiE(height) };
  const _tmp$6 = { _0: "pixelDigest", _1: _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core13sha256__final(digest.hash)) };
  const _tmp$7 = { _0: "dhash", _1: _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core10grid__hash(grid)) };
  const _tmp$8 = { _0: "contrast", _1: _M0MPC14json4Json4JsonGiE(hi - lo | 0) };
  const _p$2 = "vl-rgb-v1";
  const _bind = [_tmp$3, _tmp$4, _tmp$5, _tmp$6, _tmp$7, _tmp$8, { _0: "normalization", _1: new _M0DTPB4Json6String(_p$2) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 7), undefined);
  const result = new _M0DTPB4Json6Object(_p$3);
  if (mirrors) {
    if (result.$tag === 6) {
      const _Object = result;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "dhashMirror", _M0MPC14json4Json4JsonGsE(_M0FP36cjyhjy10visionleak4core10grid__hash(mirror_grid)));
    }
  }
  if (rotations) {
    if (result.$tag === 6) {
      const _Object = result;
      const _fields = _Object._0;
      const _p$4 = 3;
      let _tmp$9;
      if (_p$4 <= 0) {
        _tmp$9 = [];
      } else {
        const _p$5 = new Array(_p$4);
        let _tmp$10 = 0;
        while (true) {
          const _p$6 = _tmp$10;
          if (_p$6 < _p$4) {
            _p$5[_p$6] = _M0FP36cjyhjy10visionleak4core14oriented__hash(gray, width, height, _p$6 + 1 | 0, false);
            _tmp$10 = _p$6 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$9 = _p$5;
      }
      _M0MPB3Map3setGsRPB4JsonE(_fields, "dhashRotations", _M0MPC14json4Json4JsonGRPB5ArrayGsEE(_tmp$9));
      if (mirrors) {
        const _p$5 = 3;
        let _tmp$10;
        if (_p$5 <= 0) {
          _tmp$10 = [];
        } else {
          const _p$6 = new Array(_p$5);
          let _tmp$11 = 0;
          while (true) {
            const _p$7 = _tmp$11;
            if (_p$7 < _p$5) {
              _p$6[_p$7] = _M0FP36cjyhjy10visionleak4core14oriented__hash(gray, width, height, _p$7 + 1 | 0, true);
              _tmp$11 = _p$7 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$10 = _p$6;
        }
        _M0MPB3Map3setGsRPB4JsonE(_fields, "dhashMirrorRotations", _M0MPC14json4Json4JsonGRPB5ArrayGsEE(_tmp$10));
      }
    }
  }
  if (crops) {
    if (result.$tag === 6) {
      const _Object = result;
      const _fields = _Object._0;
      const _bind$2 = _M0FP36cjyhjy10visionleak4core18local__fingerprint(width, height, sums);
      if (_bind$2.$tag === 6) {
        const _Object$2 = _bind$2;
        const _local_fields = _Object$2._0;
        const _it = _M0MPB3Map5iter2GsRPB4JsonE(_local_fields);
        while (true) {
          const _bind$3 = _M0MPB5Iter24nextGsRPB4JsonE(_it);
          if (_bind$3 === undefined) {
            break;
          } else {
            const _Some = _bind$3;
            const _x = _Some;
            const _key = _x._0;
            const _value = _x._1;
            _M0MPB3Map3setGsRPB4JsonE(_fields, _key, _value);
            continue;
          }
        }
      }
    }
  }
  return result;
}
function _M0FP36cjyhjy10visionleak4core11fingerprint(width, height, rgba) {
  return _M0FP36cjyhjy10visionleak4core17fingerprint__impl(width, height, rgba, false, false, false);
}
function _M0FP36cjyhjy10visionleak4core17fingerprint__rgba(width, height, rgba) {
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11fingerprint(width, height, rgba), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core17fingerprint__json(source) {
  if (source.length > 16777216) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("JsonBudget", "fingerprint JSON exceeds 16 Mi characters"), false, 0, undefined);
  }
  if (!_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 8)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("JsonDepthBudget", "JSON structural depth exceeds 8 or is invalid"), false, 0, undefined);
  }
  let j;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        j = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidJson", "invalid bounded JSON"), false, 0, undefined);
  }
  const w = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(j, "width"));
  const h = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(j, "height"));
  if (w <= 0 || (h <= 0 || (w > 65535 || (h > 65535 || w > (1048576 / h | 0))))) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("PixelBudget", "JSON adapter supports at most 1048576 pixels"), false, 0, undefined);
  }
  const _bind = _M0FP36cjyhjy10visionleak4core5field(j, "rgba");
  if (_bind.$tag === 5) {
    const _Array = _bind;
    const _values = _Array._0;
    if (_values.length !== (Math.imul(Math.imul(w, h) | 0, 4) | 0)) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidPixels", "incorrect RGBA length"), false, 0, undefined);
    }
    const rgba = $makebytes(_values.length, 0);
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < _values.length) {
        const v = _M0FP36cjyhjy10visionleak4core7integer(_M0MPC15array5Array2atGRPB4JsonE(_values, i));
        if (v < 0 || v > 255) {
          return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidPixels", "RGBA values must be bytes"), false, 0, undefined);
        }
        if (i >>> 0 < rgba.length) {
          rgba[i] = v & 255;
        } else {
          $oob();
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11fingerprint(w, h, _M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(rgba, 0, rgba.length))), false, 0, undefined);
  } else {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidPixels", "rgba must be an array"), false, 0, undefined);
  }
}
function _M0FP36cjyhjy10visionleak4core27fingerprint__mirrored__rgba(width, height, rgba) {
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core17fingerprint__impl(width, height, rgba, true, false, false), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core27fingerprint__oriented__rgba(width, height, rgba, mirrors) {
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core17fingerprint__impl(width, height, rgba, mirrors, true, false), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core27fingerprint__combined__rgba(width, height, rgba, mirrors, rotations) {
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core17fingerprint__impl(width, height, rgba, mirrors, rotations, true), false, 0, undefined);
}
function _M0FP36cjyhjy10visionleak4core24fingerprint__local__rgba(width, height, rgba) {
  if (width <= 0 || (height <= 0 || (width > 65535 || (height > 65535 || (width > (4194304 / height | 0) || rgba.length !== (Math.imul(Math.imul(width, height) | 0, 4) | 0)))))) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidPixels", "local fingerprint requires bounded RGBA"), false, 0, undefined);
  }
  const stride = width + 1 | 0;
  const sums = $make_array_len_and_init(Math.imul(width + 1 | 0, height + 1 | 0) | 0, 0);
  let _tmp = 0;
  while (true) {
    const y = _tmp;
    if (y < height) {
      let row = 0;
      let _tmp$2 = 0;
      while (true) {
        const x = _tmp$2;
        if (x < width) {
          const p = Math.imul((Math.imul(y, width) | 0) + x | 0, 4) | 0;
          const _tmp$3 = p + 3 | 0;
          const a = _tmp$3 >>> 0 < rgba.length ? rgba[_tmp$3] : $oob();
          const r = (((Math.imul(p >>> 0 < rgba.length ? rgba[p] : $oob(), a) | 0) + (Math.imul(255, 255 - a | 0) | 0) | 0) + 127 | 0) / 255 | 0;
          const _tmp$4 = p + 1 | 0;
          const g = (((Math.imul(_tmp$4 >>> 0 < rgba.length ? rgba[_tmp$4] : $oob(), a) | 0) + (Math.imul(255, 255 - a | 0) | 0) | 0) + 127 | 0) / 255 | 0;
          const _tmp$5 = p + 2 | 0;
          const b = (((Math.imul(_tmp$5 >>> 0 < rgba.length ? rgba[_tmp$5] : $oob(), a) | 0) + (Math.imul(255, 255 - a | 0) | 0) | 0) + 127 | 0) / 255 | 0;
          row = row + (((((Math.imul(299, r) | 0) + (Math.imul(587, g) | 0) | 0) + (Math.imul(114, b) | 0) | 0) + 500 | 0) / 1000 | 0) | 0;
          const _tmp$6 = ((Math.imul(y + 1 | 0, stride) | 0) + x | 0) + 1 | 0;
          const _tmp$7 = ((Math.imul(y, stride) | 0) + x | 0) + 1 | 0;
          if (_tmp$6 >>> 0 < sums.length) {
            sums[_tmp$6] = (_tmp$7 >>> 0 < sums.length ? sums[_tmp$7] : $oob()) + row | 0;
          } else {
            $oob();
          }
          _tmp$2 = x + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = y + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core18local__fingerprint(width, height, sums), false, 0, undefined);
}
function _M0MP36cjyhjy10visionleak4core6Budget4take(self, distance) {
  if (self.work >= self.maximum) {
    self.reason = "ComparisonBudget";
    return false;
  } else {
    self.work = self.work + 1 | 0;
    if (distance) {
      self.distances = self.distances + 1 | 0;
    } else {
      self.pair_checks = self.pair_checks + 1 | 0;
    }
    return true;
  }
}
function _M0FP36cjyhjy10visionleak4core12local__query(items, i, nodes, index, seen, pairs, budget, threshold, max_pairs) {
  const item = _M0MPC15array5Array2atGRPB4JsonE(items, i);
  const _bind = item.local_hashes;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const window = _tmp;
    if (window < _bind$2) {
      const hash = _bind[window];
      _L: {
        if (_M0MPC15array5Array2atGiE(item.local_contrasts, window) < 16) {
          break _L;
        }
        const paths = _M0FP36cjyhjy10visionleak4core10mih__paths(index, hash, threshold, budget);
        const _p = budget.reason;
        const _p$2 = "";
        if (!(_p === _p$2)) {
          return undefined;
        }
        const pending = nodes.length === 0 ? [] : [0];
        while (true) {
          if (!(pending.length === 0)) {
            const _p$3 = _M0MPC15array5Array3popGiE(pending);
            let node_id;
            if (_p$3 === undefined) {
              node_id = $panic();
            } else {
              const _p$4 = _p$3;
              node_id = _p$4;
            }
            if (!_M0FP36cjyhjy10visionleak4core13mih__contains(paths, node_id)) {
              continue;
            }
            const node = _M0MPC15array5Array2atGRPB4JsonE(nodes, node_id);
            if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, true)) {
              return undefined;
            }
            const _p$4 = node.hash;
            const d = $i32_popcnt(hash.high ^ _p$4.high) + $i32_popcnt(hash.low ^ _p$4.low) | 0;
            if (d <= threshold) {
              const _bind$3 = node.members;
              const _bind$4 = _bind$3.length;
              let _tmp$2 = 0;
              while (true) {
                const _ = _tmp$2;
                if (_ < _bind$4) {
                  const _foreach_element = _bind$3[_];
                  const _j = _foreach_element._0;
                  const _left_window = _foreach_element._1;
                  _L$2: {
                    if (_M0MPB3Map8containsGibE(seen, _j) || _M0MPC15array5Array2atGRPB4JsonE(items, _j).split === item.split) {
                      break _L$2;
                    }
                    if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, false)) {
                      return undefined;
                    }
                    if (pairs.length >= max_pairs) {
                      budget.reason = "PairBudget";
                      return undefined;
                    }
                    _M0MPB3Map3setGibE(seen, _j, true);
                    const _tmp$3 = { _0: "left", _1: _M0MPC14json4Json4JsonGsE(_M0MPC15array5Array2atGRPB4JsonE(items, _j).id) };
                    const _tmp$4 = { _0: "right", _1: _M0MPC14json4Json4JsonGsE(item.id) };
                    const _p$5 = "local-candidate";
                    const _tmp$5 = { _0: "evidence", _1: new _M0DTPB4Json6String(_p$5) };
                    const _tmp$6 = { _0: "distance", _1: _M0MPC14json4Json4JsonGiE(d) };
                    const _p$6 = false;
                    const _tmp$7 = { _0: "lowContrast", _1: _p$6 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
                    const _p$7 = "unreviewed";
                    const _tmp$8 = { _0: "review", _1: new _M0DTPB4Json6String(_p$7) };
                    const _tmp$9 = { _0: "leftWindow", _1: _M0MPC14json4Json4JsonGiE(_left_window) };
                    const _tmp$10 = { _0: "rightWindow", _1: _M0MPC14json4Json4JsonGiE(window) };
                    const _p$8 = "vl-local-dhash-v1";
                    const _bind$5 = [_tmp$9, _tmp$10, { _0: "profile", _1: new _M0DTPB4Json6String(_p$8) }];
                    const _p$9 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$5, 0, 3), undefined);
                    const _bind$6 = [_tmp$3, _tmp$4, _tmp$5, _tmp$6, _tmp$7, _tmp$8, { _0: "matchLocal", _1: new _M0DTPB4Json6Object(_p$9) }];
                    const _p$10 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 7), undefined);
                    _M0MPC15array5Array4pushGsE(pairs, new _M0DTPB4Json6Object(_p$10));
                    break _L$2;
                  }
                  _tmp$2 = _ + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
            }
            const _p$5 = 0;
            const _p$6 = d - threshold | 0;
            let _tmp$2 = _p$5 > _p$6 ? _p$5 : _p$6;
            while (true) {
              const edge = _tmp$2;
              const _p$7 = 64;
              const _p$8 = d + threshold | 0;
              if (edge <= (_p$7 < _p$8 ? _p$7 : _p$8)) {
                const _bind$3 = _M0MPB3Map3getGiiE(node.children, edge);
                if (_bind$3 === undefined) {
                } else {
                  const _Some = _bind$3;
                  const _child = _Some;
                  _M0MPC15array5Array4pushGiE(pending, _child);
                }
                _tmp$2 = edge + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            continue;
          } else {
            break;
          }
        }
        break _L;
      }
      _tmp = window + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FP36cjyhjy10visionleak4core13local__insert(item, i, nodes, index, budget) {
  const _bind = item.local_hashes;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const window = _tmp;
    if (window < _bind$2) {
      const hash = _bind[window];
      _L: {
        if (_M0MPC15array5Array2atGiE(item.local_contrasts, window) < 16) {
          break _L;
        }
        if (nodes.length === 0) {
          const _tmp$2 = [{ _0: i, _1: window }];
          const _bind$3 = [];
          _M0MPC15array5Array4pushGsE(nodes, new _M0TP36cjyhjy10visionleak4core9LocalNode(hash, _tmp$2, _M0MPB3Map3MapGiiE(new _M0TPB9ArrayViewGUiiEE(_bind$3, 0, 0), undefined)));
          _M0FP36cjyhjy10visionleak4core11mih__insert(index, hash, -1);
          break _L;
        }
        let cursor = 0;
        while (true) {
          if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, true)) {
            return undefined;
          }
          const node = _M0MPC15array5Array2atGRPB4JsonE(nodes, cursor);
          const _p = node.hash;
          const d = $i32_popcnt(hash.high ^ _p.high) + $i32_popcnt(hash.low ^ _p.low) | 0;
          if (d === 0) {
            _M0MPC15array5Array4pushGsE(node.members, { _0: i, _1: window });
            break;
          }
          const _bind$3 = _M0MPB3Map3getGiiE(node.children, d);
          if (_bind$3 === undefined) {
            _M0FP36cjyhjy10visionleak4core11mih__insert(index, hash, cursor);
            _M0MPB3Map3setGiiE(node.children, d, nodes.length);
            const _tmp$2 = [{ _0: i, _1: window }];
            const _bind$4 = [];
            _M0MPC15array5Array4pushGsE(nodes, new _M0TP36cjyhjy10visionleak4core9LocalNode(hash, _tmp$2, _M0MPB3Map3MapGiiE(new _M0TPB9ArrayViewGUiiEE(_bind$4, 0, 0), undefined)));
            break;
          } else {
            const _Some = _bind$3;
            const _child = _Some;
            cursor = _child;
          }
          continue;
        }
        break _L;
      }
      _tmp = window + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FP36cjyhjy10visionleak4core13cli__defaults() {
  const _bind = [];
  const options = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 0), undefined);
  const _bind$2 = [_M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3891, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3892, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3893, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3894, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3895, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3896, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3897, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3898];
  const _bind$3 = _bind$2.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$3) {
      const row = _bind$2[_];
      _M0MPB3Map3setGsRPB4JsonE(options, row._1, _M0MPC14json4Json4JsonGiE(row._4));
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  _M0MPB3Map3setGsRPB4JsonE(options, "includeMirrors", _M0MPC14json4Json4JsonGbE(false));
  _M0MPB3Map3setGsRPB4JsonE(options, "includeRotations", _M0MPC14json4Json4JsonGbE(false));
  _M0MPB3Map3setGsRPB4JsonE(options, "includeCrops", _M0MPC14json4Json4JsonGbE(false));
  return new _M0DTPB4Json6Object(options);
}
function _M0FP36cjyhjy10visionleak4core22cli__validate__options(overrides) {
  if (overrides.$tag === 6) {
    const _Object = overrides;
    const _fields = _Object._0;
    const options = _M0FP36cjyhjy10visionleak4core13cli__defaults();
    if (options.$tag === 6) {
      const _Object$2 = options;
      const _merged = _Object$2._0;
      const _it = _M0MPB3Map5iter2GsRPB4JsonE(_fields);
      while (true) {
        const _bind = _M0MPB5Iter24nextGsRPB4JsonE(_it);
        if (_bind === undefined) {
          break;
        } else {
          const _Some = _bind;
          const _x = _Some;
          const _key = _x._0;
          const _value = _x._1;
          if (!_M0MPB3Map8containsGsRPB4JsonE(_merged, _key)) {
            return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Unknown audit option");
          }
          _M0MPB3Map3setGsRPB4JsonE(_merged, _key, _value);
          continue;
        }
      }
      const _bind = ["includeMirrors", "includeRotations", "includeCrops"];
      const _bind$2 = _bind.length;
      let _tmp = 0;
      while (true) {
        const _ = _tmp;
        if (_ < _bind$2) {
          const key = _bind[_];
          const value = _M0MPB3Map2atGsRPB4JsonE(_merged, key);
          let _tmp$2;
          if (value.$tag === 1) {
            _tmp$2 = true;
          } else {
            if (value.$tag === 2) {
              _tmp$2 = true;
            } else {
              _tmp$2 = false;
            }
          }
          if (!_tmp$2) {
            return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `${key} must be boolean`);
          }
          _tmp = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$3 = [_M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3891, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3892, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3893, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3894, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3895, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3896, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3897, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3898];
      const _bind$4 = _bind$3.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind$4) {
          const row = _bind$3[_];
          const n = _M0FP36cjyhjy10visionleak4core7integer(_M0MPB3Map2atGsRPB4JsonE(_merged, row._1));
          if (n < row._2 || n > row._3) {
            return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `${row._1} must be an integer in ${_M0MPC13int3Int18to__string_2einner(row._2, 10)}..${_M0MPC13int3Int18to__string_2einner(row._3, 10)}`);
          }
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _p = true;
      const _bind$5 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "options", _1: options }];
      const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$5, 0, 2), undefined);
      return new _M0DTPB4Json6Object(_p$2);
    } else {
      return options;
    }
  } else {
    return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Options must be an object");
  }
}
function _M0FP36cjyhjy10visionleak4core13cli__unsigned(raw, maximum) {
  if (raw === "") {
    return -1;
  }
  let n = 0;
  const _it = _M0MPC16string6String4iter(raw);
  while (true) {
    const _bind = _M0MPB4Iter4nextGcE(_it);
    if (_bind === -1) {
      break;
    } else {
      const _Some = _bind;
      const _c = _Some;
      if (_c < 48 || _c > 57) {
        return -1;
      }
      const digit = _c - 48 | 0;
      if (n > ((maximum - digit | 0) / 10 | 0)) {
        return -1;
      }
      n = (Math.imul(n, 10) | 0) + digit | 0;
      if (n > maximum) {
        return -1;
      }
      continue;
    }
  }
  return n;
}
function _M0FP36cjyhjy10visionleak4core27cli__parse__report__command(args) {
  const command = _M0MPC15array5Array2atGRPB4JsonE(args, 0);
  if (!_M0MPC15array5Array8containsGsE(["verify", "export-html", "export-fixes"], command)) {
    return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Unknown command");
  }
  const _bind = [{ _0: "command", _1: _M0MPC14json4Json4JsonGsE(command) }, { _0: "maxBytes", _1: _M0MPC14json4Json4JsonGiE(20971520) }];
  const values = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 2), undefined);
  const _bind$2 = [];
  const seen = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$2, 0, 0), undefined);
  let i = 1;
  while (true) {
    if (i < args.length) {
      const flag = _M0MPC15array5Array2atGRPB4JsonE(args, i);
      i = i + 1 | 0;
      if (_M0MPB3Map8containsGsbE(seen, flag)) {
        return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `Duplicate option: ${flag}`);
      }
      _M0MPB3Map3setGsbE(seen, flag, true);
      let allowed;
      if (flag === "--report") {
        allowed = true;
      } else {
        let _tmp;
        if (command === "verify" && flag === "--root") {
          _tmp = true;
        } else {
          let _tmp$2;
          let _tmp$3;
          const _p = "verify";
          if (!(command === _p)) {
            _tmp$3 = _M0MPC15array5Array8containsGsE(["--out", "--review"], flag);
          } else {
            _tmp$3 = false;
          }
          if (_tmp$3) {
            _tmp$2 = true;
          } else {
            _tmp$2 = command === "export-html" && flag === "--max-bytes";
          }
          _tmp = _tmp$2;
        }
        allowed = _tmp;
      }
      if (!allowed) {
        return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `Unknown option: ${flag}`);
      }
      if (i >= args.length || (_M0MPC15array5Array2atGRPB4JsonE(args, i) === "" || _M0MPC16string6String11has__prefix(_M0MPC15array5Array2atGRPB4JsonE(args, i), new _M0TPC16string10StringView(_M0FP36cjyhjy10visionleak4core27cli__parse__report__commandN7_2abindS3941, 0, _M0FP36cjyhjy10visionleak4core27cli__parse__report__commandN7_2abindS3941.length)))) {
        return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `Missing value: ${flag}`);
      }
      let key;
      switch (flag) {
        case "--report": {
          key = "report";
          break;
        }
        case "--root": {
          key = "root";
          break;
        }
        case "--out": {
          key = "out";
          break;
        }
        case "--review": {
          key = "review";
          break;
        }
        default: {
          key = "maxBytes";
        }
      }
      if (flag === "--max-bytes") {
        const size = _M0FP36cjyhjy10visionleak4core13cli__unsigned(_M0MPC15array5Array2atGRPB4JsonE(args, i), 67108864);
        if (size < 4096) {
          return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "--max-bytes must be 4096..67108864");
        }
        _M0MPB3Map3setGsRPB4JsonE(values, key, _M0MPC14json4Json4JsonGiE(size));
      } else {
        _M0MPB3Map3setGsRPB4JsonE(values, key, _M0MPC14json4Json4JsonGsE(_M0MPC15array5Array2atGRPB4JsonE(args, i)));
      }
      i = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  if (!_M0MPB3Map8containsGsRPB4JsonE(values, "report") || !_M0MPB3Map8containsGsRPB4JsonE(values, command === "verify" ? "root" : "out")) {
    return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "--report and a root or output path are required");
  }
  const _p = true;
  const _bind$3 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "args", _1: new _M0DTPB4Json6Object(values) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 2), undefined);
  return new _M0DTPB4Json6Object(_p$2);
}
function _M0FP36cjyhjy10visionleak4core10cli__parse(argv) {
  const _p = new Array(argv.length);
  const _p$2 = argv.length;
  let _tmp = 0;
  while (true) {
    const _p$3 = _tmp;
    if (_p$3 < _p$2) {
      const _p$4 = argv[_p$3];
      _p[_p$3] = _M0FP36cjyhjy10visionleak4core4text(_p$4);
      _tmp = _p$3 + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const args = _p;
  if (args.length === 0 || (_M0MPC15array5Array8containsGsE(args, "--help") || _M0MPC15array5Array2atGRPB4JsonE(args, 0) === "help")) {
    const _p$3 = true;
    const _tmp$2 = { _0: "ok", _1: _p$3 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
    const _p$4 = true;
    const _bind = [{ _0: "help", _1: _p$4 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }];
    const _p$5 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 1), undefined);
    const _bind$2 = [_tmp$2, { _0: "args", _1: new _M0DTPB4Json6Object(_p$5) }];
    const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 2), undefined);
    return new _M0DTPB4Json6Object(_p$6);
  }
  if (_M0MPC15array5Array2atGRPB4JsonE(args, 0) === "capabilities") {
    if (args.length !== 1) {
      return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "capabilities accepts no options");
    }
    const _p$3 = true;
    const _tmp$2 = { _0: "ok", _1: _p$3 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
    const _p$4 = "capabilities";
    const _bind = [{ _0: "command", _1: new _M0DTPB4Json6String(_p$4) }];
    const _p$5 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 1), undefined);
    const _bind$2 = [_tmp$2, { _0: "args", _1: new _M0DTPB4Json6Object(_p$5) }];
    const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 2), undefined);
    return new _M0DTPB4Json6Object(_p$6);
  }
  const _p$3 = _M0MPC15array5Array2atGRPB4JsonE(args, 0);
  const _p$4 = "audit";
  if (!(_p$3 === _p$4)) {
    return _M0FP36cjyhjy10visionleak4core27cli__parse__report__command(args);
  }
  const _bind = [];
  const seen = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind, 0, 0), undefined);
  const options = _M0FP36cjyhjy10visionleak4core13cli__defaults();
  if (options.$tag === 6) {
    const _Object = options;
    const _values = _Object._0;
    let force = false;
    let root = "";
    let out = "";
    let fail_on = "";
    let i = 1;
    while (true) {
      if (i < args.length) {
        const arg = _M0MPC15array5Array2atGRPB4JsonE(args, i);
        i = i + 1 | 0;
        if (_M0MPB3Map8containsGsbE(seen, arg)) {
          return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `Duplicate option: ${arg}`);
        }
        _M0MPB3Map3setGsbE(seen, arg, true);
        if (arg === "--fail-on") {
          if (i >= args.length || !_M0MPC15array5Array8containsGsE(["exact", "pixel", "candidate"], _M0MPC15array5Array2atGRPB4JsonE(args, i))) {
            return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "--fail-on requires exact, pixel, or candidate");
          }
          fail_on = _M0MPC15array5Array2atGRPB4JsonE(args, i);
          i = i + 1 | 0;
          continue;
        }
        if (arg === "--force") {
          force = true;
          continue;
        }
        if (arg === "--include-crops") {
          _M0MPB3Map3setGsRPB4JsonE(_values, "includeCrops", _M0MPC14json4Json4JsonGbE(true));
          continue;
        }
        if (arg === "--include-mirrors") {
          _M0MPB3Map3setGsRPB4JsonE(_values, "includeMirrors", _M0MPC14json4Json4JsonGbE(true));
          continue;
        }
        if (arg === "--include-rotations") {
          _M0MPB3Map3setGsRPB4JsonE(_values, "includeRotations", _M0MPC14json4Json4JsonGbE(true));
          continue;
        }
        if (arg === "--root" || arg === "--out") {
          if (i >= args.length || (_M0MPC15array5Array2atGRPB4JsonE(args, i) === "" || _M0MPC16string6String11has__prefix(_M0MPC15array5Array2atGRPB4JsonE(args, i), new _M0TPC16string10StringView(_M0FP36cjyhjy10visionleak4core10cli__parseN7_2abindS3955, 0, _M0FP36cjyhjy10visionleak4core10cli__parseN7_2abindS3955.length)))) {
            return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `Missing value: ${arg}`);
          }
          if (arg === "--root") {
            root = _M0MPC15array5Array2atGRPB4JsonE(args, i);
          } else {
            out = _M0MPC15array5Array2atGRPB4JsonE(args, i);
          }
          i = i + 1 | 0;
          continue;
        }
        let known = false;
        const _bind$2 = [_M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3891, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3892, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3893, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3894, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3895, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3896, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3897, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3898];
        const _bind$3 = _bind$2.length;
        let _tmp$2 = 0;
        while (true) {
          const _ = _tmp$2;
          if (_ < _bind$3) {
            const row = _bind$2[_];
            _L: {
              const _p$5 = row._0;
              if (!(arg === _p$5)) {
                break _L;
              }
              known = true;
              const raw = i < args.length ? _M0MPC15array5Array2atGRPB4JsonE(args, i) : "";
              const n = _M0FP36cjyhjy10visionleak4core13cli__unsigned(raw, row._3);
              if (n < row._2 || n > row._3) {
                return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `${arg} must be an integer in ${_M0MPC13int3Int18to__string_2einner(row._2, 10)}..${_M0MPC13int3Int18to__string_2einner(row._3, 10)}`);
              }
              _M0MPB3Map3setGsRPB4JsonE(_values, row._1, _M0MPC14json4Json4JsonGiE(n));
              i = i + 1 | 0;
              break;
            }
            _tmp$2 = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        if (!known) {
          return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", `Unknown option: ${arg}`);
        }
        continue;
      } else {
        break;
      }
    }
    if (root === "" || out === "") {
      return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Both --root and --out are required");
    }
    const _p$5 = true;
    const _tmp$2 = { _0: "ok", _1: _p$5 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
    const _bind$2 = [{ _0: "options", _1: options }, { _0: "force", _1: _M0MPC14json4Json4JsonGbE(force) }, { _0: "root", _1: _M0MPC14json4Json4JsonGsE(root) }, { _0: "out", _1: _M0MPC14json4Json4JsonGsE(out) }, { _0: "failOn", _1: _M0MPC14json4Json4JsonGsE(fail_on) }];
    const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 5), undefined);
    const _bind$3 = [_tmp$2, { _0: "args", _1: new _M0DTPB4Json6Object(_p$6) }];
    const _p$7 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 2), undefined);
    return new _M0DTPB4Json6Object(_p$7);
  } else {
    return options;
  }
}
function _M0FP36cjyhjy10visionleak4core20split__alias__groups() {
  return [{ _0: "train", _1: ["train", "training"] }, { _0: "validation", _1: ["validation", "val", "valid", "dev"] }, { _0: "test", _1: ["test", "testing"] }];
}
function _M0FP36cjyhjy10visionleak4core21resolve__split__scope(names) {
  const _bind = [];
  const present = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind, 0, 0), undefined);
  const _bind$2 = names.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const name = names[_];
      if (name.$tag === 4) {
        const _String = name;
        const _value = _String._0;
        _M0MPB3Map3setGsbE(present, _value, true);
      } else {
        return _M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Split directory names must be strings");
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const directories = [];
  const _bind$3 = [];
  const mapping = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$3, 0, 0), undefined);
  const missing = [];
  const _bind$4 = _M0FP36cjyhjy10visionleak4core20split__alias__groups();
  const _bind$5 = _bind$4.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$5) {
      const _foreach_element = _bind$4[_];
      const _split = _foreach_element._0;
      const _aliases = _foreach_element._1;
      _L: {
        const _p = [];
        const _p$2 = _aliases.length;
        let _tmp$3 = 0;
        while (true) {
          const _p$3 = _tmp$3;
          if (_p$3 < _p$2) {
            const _p$4 = _aliases[_p$3];
            if (_M0MPB3Map8containsGsbE(present, _p$4)) {
              _M0MPC15array5Array4pushGsE(_p, _p$4);
            }
            _tmp$3 = _p$3 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        const found = _p;
        if (found.length > 1) {
          const _p$3 = false;
          const _tmp$4 = { _0: "ok", _1: _p$3 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
          const _p$4 = "SPLIT_ALIAS_CONFLICT";
          const _tmp$5 = { _0: "code", _1: new _M0DTPB4Json6String(_p$4) };
          const _p$5 = "Multiple directories name the same split";
          const _bind$6 = [_tmp$5, { _0: "message", _1: new _M0DTPB4Json6String(_p$5) }, { _0: "split", _1: _M0MPC14json4Json4JsonGsE(_split) }, { _0: "directories", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(found) }];
          const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 4), undefined);
          const _bind$7 = [_tmp$4, { _0: "error", _1: new _M0DTPB4Json6Object(_p$6) }];
          const _p$7 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$7, 0, 2), undefined);
          const result = new _M0DTPB4Json6Object(_p$7);
          return result;
        }
        if (found.length === 0) {
          _M0MPC15array5Array4pushGsE(missing, _split);
          break _L;
        }
        const _bind$6 = [{ _0: "directory", _1: _M0MPC14json4Json4JsonGsE(_M0MPC15array5Array2atGRPB4JsonE(found, 0)) }, { _0: "split", _1: _M0MPC14json4Json4JsonGsE(_split) }];
        const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 2), undefined);
        _M0MPC15array5Array4pushGsE(directories, new _M0DTPB4Json6Object(_p$3));
        _M0MPB3Map3setGsRPB4JsonE(mapping, _M0MPC15array5Array2atGRPB4JsonE(found, 0), _M0MPC14json4Json4JsonGsE(_split));
        break _L;
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _p = true;
  const _bind$6 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "directories", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(directories) }, { _0: "mapping", _1: new _M0DTPB4Json6Object(mapping) }, { _0: "missingSplits", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(missing) }];
  const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 4), undefined);
  return new _M0DTPB4Json6Object(_p$2);
}
function _M0FP36cjyhjy10visionleak4core18cli__options__json(source) {
  if (source.length > 1048576 || !_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 16)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "CLI request exceeds its bounded input budget"), false, 0, undefined);
  }
  let request;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        request = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Invalid CLI request JSON"), false, 0, undefined);
  }
  const _bind = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(request, "operation"));
  switch (_bind) {
    case "splitAliases": {
      const aliases = [];
      const _bind$2 = _M0FP36cjyhjy10visionleak4core20split__alias__groups();
      const _bind$3 = _bind$2.length;
      let _tmp = 0;
      while (true) {
        const _ = _tmp;
        if (_ < _bind$3) {
          const row = _bind$2[_];
          const _bind$4 = row._1;
          const _bind$5 = _bind$4.length;
          let _tmp$2 = 0;
          while (true) {
            const _$2 = _tmp$2;
            if (_$2 < _bind$5) {
              const name = _bind$4[_$2];
              _M0MPC15array5Array4pushGsE(aliases, name);
              _tmp$2 = _$2 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _p = true;
      const _bind$4 = [{ _0: "ok", _1: _p ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "aliases", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(aliases) }];
      const _p$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$4, 0, 2), undefined);
      const result = new _M0DTPB4Json6Object(_p$2);
      return _M0MPC14json4Json17stringify_2einner(result, false, 0, undefined);
    }
    case "splits": {
      const _bind$5 = _M0FP36cjyhjy10visionleak4core5field(request, "names");
      if (_bind$5.$tag === 5) {
        const _Array = _bind$5;
        const _names = _Array._0;
        return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core21resolve__split__scope(_names), false, 0, undefined);
      } else {
        return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Split names must be an array"), false, 0, undefined);
      }
    }
    case "limits": {
      const _bind$6 = [];
      const limits = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 0), undefined);
      const _bind$7 = [_M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3891, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3892, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3893, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3894, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3895, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3896, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3897, _M0FP36cjyhjy10visionleak4core11cli__limitsN5tupleS3898];
      const _bind$8 = _bind$7.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind$8) {
          const row = _bind$7[_];
          const _tmp$3 = row._1;
          const _bind$9 = [{ _0: "flag", _1: _M0MPC14json4Json4JsonGsE(row._0) }, { _0: "minimum", _1: _M0MPC14json4Json4JsonGiE(row._2) }, { _0: "maximum", _1: _M0MPC14json4Json4JsonGiE(row._3) }, { _0: "default", _1: _M0MPC14json4Json4JsonGiE(row._4) }];
          const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 4), undefined);
          _M0MPB3Map3setGsRPB4JsonE(limits, _tmp$3, new _M0DTPB4Json6Object(_p$3));
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$9 = [];
      const aliases$2 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 0), undefined);
      const _bind$10 = _M0FP36cjyhjy10visionleak4core20split__alias__groups();
      const _bind$11 = _bind$10.length;
      let _tmp$3 = 0;
      while (true) {
        const _ = _tmp$3;
        if (_ < _bind$11) {
          const _foreach_element = _bind$10[_];
          const _split = _foreach_element._0;
          const _names = _foreach_element._1;
          _M0MPB3Map3setGsRPB4JsonE(aliases$2, _split, _M0MPC14json4Json4JsonGRPB5ArrayGsEE(_names));
          _tmp$3 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _p$3 = true;
      const _bind$12 = [{ _0: "ok", _1: _p$3 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "limits", _1: new _M0DTPB4Json6Object(limits) }, { _0: "splitAliases", _1: new _M0DTPB4Json6Object(aliases$2) }];
      const _p$4 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$12, 0, 3), undefined);
      const result$2 = new _M0DTPB4Json6Object(_p$4);
      return _M0MPC14json4Json17stringify_2einner(result$2, false, 0, undefined);
    }
    case "defaults": {
      const _p$5 = true;
      const _bind$13 = [{ _0: "ok", _1: _p$5 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ }, { _0: "options", _1: _M0FP36cjyhjy10visionleak4core13cli__defaults() }];
      const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$13, 0, 2), undefined);
      const result$3 = new _M0DTPB4Json6Object(_p$6);
      return _M0MPC14json4Json17stringify_2einner(result$3, false, 0, undefined);
    }
    case "parse": {
      const _bind$14 = _M0FP36cjyhjy10visionleak4core5field(request, "argv");
      if (_bind$14.$tag === 5) {
        const _Array = _bind$14;
        const _args = _Array._0;
        return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core10cli__parse(_args), false, 0, undefined);
      } else {
        return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Arguments must be an array"), false, 0, undefined);
      }
    }
    case "options": {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core22cli__validate__options(_M0FP36cjyhjy10visionleak4core5field(request, "overrides")), false, 0, undefined);
    }
    default: {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ARGUMENT_ERROR", "Unknown CLI operation"), false, 0, undefined);
    }
  }
}
function _M0FP36cjyhjy10visionleak4core21pack__validated__hash(bits) {
  let high = 0;
  let low = 0;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < 32) {
      const _tmp$2 = high << 1;
      let _tmp$3;
      const _p = i >>> 0 < bits.length ? bits.charCodeAt(i) : $oob();
      const _p$2 = 49;
      if (_p === _p$2) {
        _tmp$3 = 1;
      } else {
        _tmp$3 = 0;
      }
      high = _tmp$2 | _tmp$3;
      const _tmp$4 = low << 1;
      let _tmp$5;
      const _tmp$6 = i + 32 | 0;
      const _p$3 = _tmp$6 >>> 0 < bits.length ? bits.charCodeAt(_tmp$6) : $oob();
      const _p$4 = 49;
      if (_p$3 === _p$4) {
        _tmp$5 = 1;
      } else {
        _tmp$5 = 0;
      }
      low = _tmp$4 | _tmp$5;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0TP36cjyhjy10visionleak4core6Hash64(high, low);
}
function _M0FP36cjyhjy10visionleak4core12append__pair(items, left, right, distance, pairs, parents, budget, max_pairs, transform, rotations) {
  const a = _M0MPC15array5Array2atGRPB4JsonE(items, left);
  const b = _M0MPC15array5Array2atGRPB4JsonE(items, right);
  if (a.split === b.split) {
    return true;
  }
  if (pairs.length >= max_pairs) {
    budget.reason = "PairBudget";
    return false;
  }
  const kind = a.bytes === b.bytes ? "byte-identical" : a.pixels === b.pixels ? "pixel-identical" : "perceptual-candidate";
  const _p = "perceptual-candidate";
  if (!(kind === _p)) {
    const ra = _M0FP36cjyhjy10visionleak4core4root(parents, left);
    const rb = _M0FP36cjyhjy10visionleak4core4root(parents, right);
    _M0MPC15array5Array3setGiE(parents, rb, ra);
  }
  const _tmp = { _0: "left", _1: _M0MPC14json4Json4JsonGsE(a.id) };
  const _tmp$2 = { _0: "right", _1: _M0MPC14json4Json4JsonGsE(b.id) };
  const _tmp$3 = { _0: "evidence", _1: _M0MPC14json4Json4JsonGsE(kind) };
  const _tmp$4 = { _0: "distance", _1: _M0MPC14json4Json4JsonGiE(distance) };
  const _tmp$5 = { _0: "lowContrast", _1: _M0MPC14json4Json4JsonGbE(a.contrast < 16 || b.contrast < 16) };
  const _p$2 = "unreviewed";
  const _bind = [_tmp, _tmp$2, _tmp$3, _tmp$4, _tmp$5, { _0: "review", _1: new _M0DTPB4Json6String(_p$2) }];
  const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind, 0, 6), undefined);
  const pair = new _M0DTPB4Json6Object(_p$3);
  let _tmp$6;
  const _p$4 = "original";
  if (!(transform === _p$4)) {
    _tmp$6 = kind === "perceptual-candidate";
  } else {
    _tmp$6 = false;
  }
  if (_tmp$6) {
    if (pair.$tag === 6) {
      const _Object = pair;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, rotations ? "matchOrientation" : "matchTransform", _M0MPC14json4Json4JsonGsE(transform));
    }
  }
  _M0MPC15array5Array4pushGsE(pairs, pair);
  return true;
}
function _M0FP36cjyhjy10visionleak4core16mirror__distance(a, b, budget) {
  let best = 65;
  let transform = "original";
  const labels = ["original", "mirror-left", "mirror-right", "mirror-both"];
  let _tmp = 0;
  while (true) {
    const k = _tmp;
    if (k < 4) {
      if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, true)) {
        return _M0FP36cjyhjy10visionleak4core16mirror__distanceN5tupleS4083;
      }
      const left = k === 1 || k === 3 ? a.mirror_hash : a.hash;
      const right = k === 2 || k === 3 ? b.mirror_hash : b.hash;
      const d = $i32_popcnt(left.high ^ right.high) + $i32_popcnt(left.low ^ right.low) | 0;
      if (d < best) {
        best = d;
        transform = _M0MPC15array5Array2atGRPB4JsonE(labels, k);
      }
      _tmp = k + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return { _0: best, _1: transform };
}
function _M0FP36cjyhjy10visionleak4core19orientation__labels(mirrors) {
  const names = ["original", "rotate90", "rotate180", "rotate270"];
  const labels = [];
  const _bind = names.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const name = names[_];
      _M0MPC15array5Array4pushGsE(labels, name);
      if (mirrors) {
        _M0MPC15array5Array4pushGsE(labels, name === "original" ? "mirror" : `${name}-mirror`);
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return labels;
}
function _M0FP36cjyhjy10visionleak4core21orientation__distance(a, b, budget, mirrors) {
  const labels = _M0FP36cjyhjy10visionleak4core19orientation__labels(mirrors);
  let best = 65;
  let transform = "";
  let _tmp = 0;
  while (true) {
    const j = _tmp;
    if (j < b.orientation_hashes.length) {
      let _tmp$2 = 0;
      while (true) {
        const i = _tmp$2;
        if (i < a.orientation_hashes.length) {
          if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, true)) {
            return _M0FP36cjyhjy10visionleak4core21orientation__distanceN5tupleS4102;
          }
          const _p = _M0MPC15array5Array2atGRPB4JsonE(a.orientation_hashes, i);
          const _p$2 = _M0MPC15array5Array2atGRPB4JsonE(b.orientation_hashes, j);
          const d = $i32_popcnt(_p.high ^ _p$2.high) + $i32_popcnt(_p.low ^ _p$2.low) | 0;
          if (d < best) {
            best = d;
            transform = `${_M0MPC15array5Array2atGRPB4JsonE(labels, i)}/${_M0MPC15array5Array2atGRPB4JsonE(labels, j)}`;
            if (best === 0) {
              return { _0: best, _1: transform };
            }
          }
          _tmp$2 = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = j + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return { _0: best, _1: transform };
}
function _M0FP36cjyhjy10visionleak4core10run__audit(items, threshold, max_work, max_pairs, max_images, include_mirrors, include_rotations, include_crops) {
  const pairs = [];
  const nodes = [];
  const local_nodes = [];
  const index = _M0FP36cjyhjy10visionleak4core8mih__new();
  const local_index = _M0FP36cjyhjy10visionleak4core8mih__new();
  let local_work = 0;
  const _bind = [];
  const by_bytes = _M0MPB3Map3MapGsRPB5ArrayGiEE(new _M0TPB9ArrayViewGUsRPB5ArrayGiEEE(_bind, 0, 0), undefined);
  const _bind$2 = [];
  const by_pixels = _M0MPB3Map3MapGsRPB5ArrayGiEE(new _M0TPB9ArrayViewGUsRPB5ArrayGiEEE(_bind$2, 0, 0), undefined);
  const _p = items.length;
  let parents;
  if (_p <= 0) {
    parents = [];
  } else {
    const _p$2 = new Array(_p);
    let _tmp = 0;
    while (true) {
      const _p$3 = _tmp;
      if (_p$3 < _p) {
        _p$2[_p$3] = _p$3;
        _tmp = _p$3 + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    parents = _p$2;
  }
  const budget = new _M0TP36cjyhjy10visionleak4core6Budget(max_work, 0, 0, 0, 0, _M0FP36cjyhjy10visionleak4core10run__auditN7_2abindS4115);
  let processed = 0;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < items.length) {
      const item = _M0MPC15array5Array2atGRPB4JsonE(items, i);
      const _bind$3 = [];
      const seen = _M0MPB3Map3MapGibE(new _M0TPB9ArrayViewGUibEE(_bind$3, 0, 0), undefined);
      const exact_buckets = [_M0MPC16option6Option10unwrap__orGRPB5ArrayGiEE(_M0MPB3Map3getGsRPB5ArrayGiEE(by_bytes, item.bytes), []), _M0MPC16option6Option10unwrap__orGRPB5ArrayGiEE(_M0MPB3Map3getGsRPB5ArrayGiEE(by_pixels, item.pixels), [])];
      const _bind$4 = exact_buckets.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind$4) {
          const bucket = exact_buckets[_];
          const _bind$5 = bucket.length;
          let _tmp$3 = 0;
          while (true) {
            const _$2 = _tmp$3;
            if (_$2 < _bind$5) {
              const j = bucket[_$2];
              _L: {
                if (_M0MPB3Map8containsGibE(seen, j)) {
                  break _L;
                }
                _M0MPB3Map3setGibE(seen, j, true);
                if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, false)) {
                  break;
                }
                const _p$2 = _M0MPC15array5Array2atGRPB4JsonE(items, j).hash;
                const _p$3 = item.hash;
                if (!_M0FP36cjyhjy10visionleak4core12append__pair(items, j, i, $i32_popcnt(_p$2.high ^ _p$3.high) + $i32_popcnt(_p$2.low ^ _p$3.low) | 0, pairs, parents, budget, max_pairs, "original", include_rotations)) {
                  break;
                }
                break _L;
              }
              _tmp$3 = _$2 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const _p$2 = budget.reason;
          const _p$3 = "";
          if (!(_p$2 === _p$3)) {
            break;
          }
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _p$2 = budget.reason;
      const _p$3 = "";
      if (!(_p$2 === _p$3)) {
        break;
      }
      const variants = include_rotations ? item.orientation_hashes : include_mirrors ? [item.hash, item.mirror_hash] : [item.hash];
      const _bind$5 = variants.length;
      let _tmp$3 = 0;
      while (true) {
        const _ = _tmp$3;
        if (_ < _bind$5) {
          const query_hash = variants[_];
          const paths = _M0FP36cjyhjy10visionleak4core10mih__paths(index, query_hash, threshold, budget);
          const _p$4 = budget.reason;
          const _p$5 = "";
          if (!(_p$4 === _p$5)) {
            break;
          }
          const pending = nodes.length === 0 ? [] : [0];
          while (true) {
            if (!(pending.length === 0)) {
              const _p$6 = _M0MPC15array5Array3popGiE(pending);
              let node_id;
              if (_p$6 === undefined) {
                node_id = $panic();
              } else {
                const _p$7 = _p$6;
                node_id = _p$7;
              }
              if (!_M0FP36cjyhjy10visionleak4core13mih__contains(paths, node_id)) {
                continue;
              }
              const n = _M0MPC15array5Array2atGRPB4JsonE(nodes, node_id);
              if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, true)) {
                break;
              }
              const _p$7 = n.hash;
              const d = $i32_popcnt(query_hash.high ^ _p$7.high) + $i32_popcnt(query_hash.low ^ _p$7.low) | 0;
              if (d <= threshold) {
                const _bind$6 = n.members;
                const _bind$7 = _bind$6.length;
                let _tmp$4 = 0;
                while (true) {
                  const _$2 = _tmp$4;
                  if (_$2 < _bind$7) {
                    const j = _bind$6[_$2];
                    _L: {
                      if (_M0MPB3Map8containsGibE(seen, j)) {
                        break _L;
                      }
                      if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, false)) {
                        break;
                      }
                      const _bind$8 = include_rotations ? _M0FP36cjyhjy10visionleak4core21orientation__distance(_M0MPC15array5Array2atGRPB4JsonE(items, j), item, budget, include_mirrors) : include_mirrors ? _M0FP36cjyhjy10visionleak4core16mirror__distance(_M0MPC15array5Array2atGRPB4JsonE(items, j), item, budget) : { _0: d, _1: "original" };
                      const _pair_d = _bind$8._0;
                      const _transform = _bind$8._1;
                      const _p$8 = budget.reason;
                      const _p$9 = "";
                      if (!(_p$8 === _p$9)) {
                        break;
                      }
                      _M0MPB3Map3setGibE(seen, j, true);
                      if (!_M0FP36cjyhjy10visionleak4core12append__pair(items, j, i, _pair_d, pairs, parents, budget, max_pairs, _transform, include_rotations)) {
                        break;
                      }
                      break _L;
                    }
                    _tmp$4 = _$2 + 1 | 0;
                    continue;
                  } else {
                    break;
                  }
                }
              }
              const _p$8 = budget.reason;
              const _p$9 = "";
              if (!(_p$8 === _p$9)) {
                break;
              }
              const _p$10 = 0;
              const _p$11 = d - threshold | 0;
              let _tmp$4 = _p$10 > _p$11 ? _p$10 : _p$11;
              while (true) {
                const edge = _tmp$4;
                const _p$12 = 64;
                const _p$13 = d + threshold | 0;
                if (edge <= (_p$12 < _p$13 ? _p$12 : _p$13)) {
                  const _bind$6 = _M0MPB3Map3getGiiE(n.children, edge);
                  if (_bind$6 === undefined) {
                  } else {
                    const _Some = _bind$6;
                    const _child = _Some;
                    _M0MPC15array5Array4pushGiE(pending, _child);
                  }
                  _tmp$4 = edge + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              continue;
            } else {
              break;
            }
          }
          const _p$6 = budget.reason;
          const _p$7 = "";
          if (!(_p$6 === _p$7)) {
            break;
          }
          _tmp$3 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _p$4 = budget.reason;
      const _p$5 = "";
      if (!(_p$4 === _p$5)) {
        break;
      }
      if (include_crops) {
        const before = budget.work;
        _M0FP36cjyhjy10visionleak4core12local__query(items, i, local_nodes, local_index, seen, pairs, budget, threshold, max_pairs);
        if (budget.reason === "") {
          _M0FP36cjyhjy10visionleak4core13local__insert(item, i, local_nodes, local_index, budget);
        }
        local_work = (local_work + budget.work | 0) - before | 0;
        const _p$6 = budget.reason;
        const _p$7 = "";
        if (!(_p$6 === _p$7)) {
          break;
        }
      }
      const _bind$6 = variants.length;
      let _tmp$4 = 0;
      while (true) {
        const _ = _tmp$4;
        if (_ < _bind$6) {
          const insert_hash = variants[_];
          if (nodes.length === 0) {
            const _tmp$5 = [i];
            const _bind$7 = [];
            _M0MPC15array5Array4pushGsE(nodes, new _M0TP36cjyhjy10visionleak4core6BkNode(insert_hash, _tmp$5, _M0MPB3Map3MapGiiE(new _M0TPB9ArrayViewGUiiEE(_bind$7, 0, 0), undefined)));
            if (threshold <= 7) {
              _M0FP36cjyhjy10visionleak4core11mih__insert(index, insert_hash, -1);
            }
          } else {
            let cursor = 0;
            while (true) {
              if (!_M0MP36cjyhjy10visionleak4core6Budget4take(budget, true)) {
                break;
              }
              const n = _M0MPC15array5Array2atGRPB4JsonE(nodes, cursor);
              const _p$6 = n.hash;
              const d = $i32_popcnt(insert_hash.high ^ _p$6.high) + $i32_popcnt(insert_hash.low ^ _p$6.low) | 0;
              if (d === 0) {
                _M0MPC15array5Array4pushGiE(n.members, i);
                break;
              }
              const _bind$7 = _M0MPB3Map3getGiiE(n.children, d);
              if (_bind$7 === undefined) {
                if (threshold <= 7) {
                  _M0FP36cjyhjy10visionleak4core11mih__insert(index, insert_hash, cursor);
                }
                _M0MPB3Map3setGiiE(n.children, d, nodes.length);
                const _tmp$5 = [i];
                const _bind$8 = [];
                _M0MPC15array5Array4pushGsE(nodes, new _M0TP36cjyhjy10visionleak4core6BkNode(insert_hash, _tmp$5, _M0MPB3Map3MapGiiE(new _M0TPB9ArrayViewGUiiEE(_bind$8, 0, 0), undefined)));
                break;
              } else {
                const _Some = _bind$7;
                const _child = _Some;
                cursor = _child;
              }
              continue;
            }
          }
          const _p$6 = budget.reason;
          const _p$7 = "";
          if (!(_p$6 === _p$7)) {
            break;
          }
          _tmp$4 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _p$6 = budget.reason;
      const _p$7 = "";
      if (!(_p$6 === _p$7)) {
        break;
      }
      const _bind$7 = _M0MPB3Map3getGsRPB5ArrayGiEE(by_bytes, item.bytes);
      if (_bind$7.$tag === 1) {
        const _Some = _bind$7;
        const _b = _Some._0;
        _M0MPC15array5Array4pushGiE(_b, i);
      } else {
        _M0MPB3Map3setGsRPB5ArrayGiEE(by_bytes, item.bytes, [i]);
      }
      const _bind$8 = _M0MPB3Map3getGsRPB5ArrayGiEE(by_pixels, item.pixels);
      if (_bind$8.$tag === 1) {
        const _Some = _bind$8;
        const _b = _Some._0;
        _M0MPC15array5Array4pushGiE(_b, i);
      } else {
        _M0MPB3Map3setGsRPB5ArrayGiEE(by_pixels, item.pixels, [i]);
      }
      processed = processed + 1 | 0;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$3 = [];
  const components = _M0MPB3Map3MapGiRPB5ArrayGsEE(new _M0TPB9ArrayViewGUiRPB5ArrayGsEEE(_bind$3, 0, 0), undefined);
  let _tmp$2 = 0;
  while (true) {
    const i = _tmp$2;
    if (i < items.length) {
      const r = _M0FP36cjyhjy10visionleak4core4root(parents, i);
      const _bind$4 = _M0MPB3Map3getGiRPB5ArrayGsEE(components, r);
      if (_bind$4.$tag === 1) {
        const _Some = _bind$4;
        const _c = _Some._0;
        _M0MPC15array5Array4pushGsE(_c, _M0MPC15array5Array2atGRPB4JsonE(items, i).id);
      } else {
        _M0MPB3Map3setGiRPB5ArrayGsEE(components, r, [_M0MPC15array5Array2atGRPB4JsonE(items, i).id]);
      }
      _tmp$2 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const groups = [];
  let _tmp$3 = 0;
  while (true) {
    const i = _tmp$3;
    if (i < items.length) {
      const _bind$4 = _M0MPB3Map3getGiRPB5ArrayGsEE(components, i);
      if (_bind$4.$tag === 1) {
        const _Some = _bind$4;
        const _members = _Some._0;
        if (_members.length > 1) {
          const _tmp$4 = { _0: "members", _1: _M0MPC14json4Json4JsonGRPB5ArrayGsEE(_members) };
          const _p$2 = "exact-component";
          const _bind$5 = [_tmp$4, { _0: "evidence", _1: new _M0DTPB4Json6String(_p$2) }];
          const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$5, 0, 2), undefined);
          _M0MPC15array5Array4pushGsE(groups, new _M0DTPB4Json6Object(_p$3));
        }
      }
      _tmp$3 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const complete = budget.reason === "";
  const _p$2 = true;
  const _tmp$4 = { _0: "ok", _1: _p$2 ? _M0DTPB4Json4True__ : _M0DTPB4Json5False__ };
  const _tmp$5 = { _0: "complete", _1: _M0MPC14json4Json4JsonGbE(complete) };
  const _tmp$6 = { _0: "status", _1: _M0MPC14json4Json4JsonGsE(complete ? "complete" : "incomplete") };
  const _p$3 = "vl-rgb-v1";
  const _tmp$7 = { _0: "normalization", _1: new _M0DTPB4Json6String(_p$3) };
  const _tmp$8 = { _0: "pairs", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(pairs) };
  const _tmp$9 = { _0: "groups", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB4JsonEE(groups) };
  const _bind$4 = [{ _0: "threshold", _1: _M0MPC14json4Json4JsonGiE(threshold) }, { _0: "maxComparisons", _1: _M0MPC14json4Json4JsonGiE(max_work) }, { _0: "maxPairs", _1: _M0MPC14json4Json4JsonGiE(max_pairs) }, { _0: "maxImages", _1: _M0MPC14json4Json4JsonGiE(max_images) }];
  const _p$4 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$4, 0, 4), undefined);
  const _tmp$10 = { _0: "options", _1: new _M0DTPB4Json6Object(_p$4) };
  const _bind$5 = [{ _0: "inputImages", _1: _M0MPC14json4Json4JsonGiE(items.length) }, { _0: "processedImages", _1: _M0MPC14json4Json4JsonGiE(processed) }, { _0: "comparisons", _1: _M0MPC14json4Json4JsonGiE(budget.work) }, { _0: "distanceEvaluations", _1: _M0MPC14json4Json4JsonGiE(budget.distances) }, { _0: "pairChecks", _1: _M0MPC14json4Json4JsonGiE(budget.pair_checks) }, { _0: "emittedPairs", _1: _M0MPC14json4Json4JsonGiE(pairs.length) }, { _0: "indexNodes", _1: _M0MPC14json4Json4JsonGiE(nodes.length) }, { _0: "reason", _1: _M0MPC14json4Json4JsonGsE(budget.reason) }];
  const _p$5 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$5, 0, 8), undefined);
  const _bind$6 = [_tmp$4, _tmp$5, _tmp$6, _tmp$7, _tmp$8, _tmp$9, _tmp$10, { _0: "stats", _1: new _M0DTPB4Json6Object(_p$5) }];
  const _p$6 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$6, 0, 8), undefined);
  const result = new _M0DTPB4Json6Object(_p$6);
  if (budget.index_work > 0) {
    const _bind$7 = _M0FP36cjyhjy10visionleak4core5field(result, "stats");
    if (_bind$7.$tag === 6) {
      const _Object = _bind$7;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "indexOperations", _M0MPC14json4Json4JsonGiE(budget.index_work));
      _M0MPB3Map3setGsRPB4JsonE(_fields, "indexOperationLimit", _M0MPC14json4Json4JsonGiE(Math.imul(max_work, 16) | 0));
    }
  }
  if (include_mirrors) {
    const _bind$7 = _M0FP36cjyhjy10visionleak4core5field(result, "options");
    if (_bind$7.$tag === 6) {
      const _Object = _bind$7;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "includeMirrors", _M0MPC14json4Json4JsonGbE(true));
    }
  }
  if (include_rotations) {
    const _bind$7 = _M0FP36cjyhjy10visionleak4core5field(result, "options");
    if (_bind$7.$tag === 6) {
      const _Object = _bind$7;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "includeRotations", _M0MPC14json4Json4JsonGbE(true));
    }
  }
  if (include_crops) {
    const _bind$7 = _M0FP36cjyhjy10visionleak4core5field(result, "options");
    if (_bind$7.$tag === 6) {
      const _Object = _bind$7;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "includeCrops", _M0MPC14json4Json4JsonGbE(true));
    }
    const _bind$8 = _M0FP36cjyhjy10visionleak4core5field(result, "stats");
    if (_bind$8.$tag === 6) {
      const _Object = _bind$8;
      const _fields = _Object._0;
      _M0MPB3Map3setGsRPB4JsonE(_fields, "localComparisons", _M0MPC14json4Json4JsonGiE(local_work));
      _M0MPB3Map3setGsRPB4JsonE(_fields, "localIndexNodes", _M0MPC14json4Json4JsonGiE(local_nodes.length));
    }
    if (result.$tag === 6) {
      const _Object = result;
      const _fields = _Object._0;
      const _p$7 = "vl-local-dhash-v1";
      const _tmp$11 = { _0: "version", _1: new _M0DTPB4Json6String(_p$7) };
      const _tmp$12 = { _0: "windows", _1: _M0MPC14json4Json4JsonGRPB5ArrayGRPB5ArrayGiEEE(_M0FP36cjyhjy10visionleak4core13crop__windows()) };
      const _p$8 = 16;
      const _p$9 = undefined;
      const _tmp$13 = { _0: "minimumGridContrast", _1: new _M0DTPB4Json6Number(_p$8, _p$9) };
      const _p$10 = "first deterministic window witness within threshold; not a minimum over all windows";
      const _bind$9 = [_tmp$11, _tmp$12, _tmp$13, { _0: "distanceSemantics", _1: new _M0DTPB4Json6String(_p$10) }];
      const _p$11 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$9, 0, 4), undefined);
      _M0MPB3Map3setGsRPB4JsonE(_fields, "localProfile", new _M0DTPB4Json6Object(_p$11));
    }
  }
  return result;
}
function _M0FP36cjyhjy10visionleak4core6option(options, key, fallback) {
  const _bind = _M0FP36cjyhjy10visionleak4core5field(options, key);
  if (_bind.$tag === 0) {
    return fallback;
  } else {
    return _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(options, key));
  }
}
function _M0FP36cjyhjy10visionleak4core11audit__json(source) {
  if (source.length > 16777216) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("JsonBudget", "audit JSON exceeds 16 Mi characters"), false, 0, undefined);
  }
  if (!_M0FP36cjyhjy10visionleak4core14bounded__depth(source, 8)) {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("JsonDepthBudget", "JSON structural depth exceeds 8 or is invalid"), false, 0, undefined);
  }
  let j;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FPC14json13parse_2einner(new _M0TPC16string10StringView(source, 0, source.length), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        j = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidJson", "invalid bounded JSON"), false, 0, undefined);
  }
  if (j.$tag === 6) {
    const opts = _M0FP36cjyhjy10visionleak4core5field(j, "options");
    let _tmp;
    if (opts.$tag === 6) {
      _tmp = true;
    } else {
      if (opts.$tag === 0) {
        _tmp = true;
      } else {
        _tmp = false;
      }
    }
    if (!_tmp) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidOptions", "options must be an object"), false, 0, undefined);
    }
    const mirror_option = _M0FP36cjyhjy10visionleak4core5field(opts, "includeMirrors");
    let _tmp$2;
    if (mirror_option.$tag === 1) {
      _tmp$2 = true;
    } else {
      if (mirror_option.$tag === 2) {
        _tmp$2 = true;
      } else {
        if (mirror_option.$tag === 0) {
          _tmp$2 = true;
        } else {
          _tmp$2 = false;
        }
      }
    }
    if (!_tmp$2) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidOptions", "includeMirrors must be a boolean"), false, 0, undefined);
    }
    const include_mirrors = _M0IPC14json4JsonPB2Eq5equal(mirror_option, _M0MPC14json4Json4JsonGbE(true));
    const rotation_option = _M0FP36cjyhjy10visionleak4core5field(opts, "includeRotations");
    let _tmp$3;
    if (rotation_option.$tag === 1) {
      _tmp$3 = true;
    } else {
      if (rotation_option.$tag === 2) {
        _tmp$3 = true;
      } else {
        if (rotation_option.$tag === 0) {
          _tmp$3 = true;
        } else {
          _tmp$3 = false;
        }
      }
    }
    if (!_tmp$3) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidOptions", "includeRotations must be a boolean"), false, 0, undefined);
    }
    const include_rotations = _M0IPC14json4JsonPB2Eq5equal(rotation_option, _M0MPC14json4Json4JsonGbE(true));
    const crop_option = _M0FP36cjyhjy10visionleak4core5field(opts, "includeCrops");
    let _tmp$4;
    if (crop_option.$tag === 1) {
      _tmp$4 = true;
    } else {
      if (crop_option.$tag === 2) {
        _tmp$4 = true;
      } else {
        if (crop_option.$tag === 0) {
          _tmp$4 = true;
        } else {
          _tmp$4 = false;
        }
      }
    }
    if (!_tmp$4) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidOptions", "includeCrops must be boolean"), false, 0, undefined);
    }
    const include_crops = _M0IPC14json4JsonPB2Eq5equal(crop_option, _M0MPC14json4Json4JsonGbE(true));
    const threshold = _M0FP36cjyhjy10visionleak4core6option(opts, "threshold", 6);
    const max_work = _M0FP36cjyhjy10visionleak4core6option(opts, "maxComparisons", 1000000);
    const max_pairs = _M0FP36cjyhjy10visionleak4core6option(opts, "maxPairs", 10000);
    const max_images = _M0FP36cjyhjy10visionleak4core6option(opts, "maxImages", 1000);
    if (threshold < 0 || (threshold > 64 || (max_work < 0 || (max_work > 10000000 || (max_pairs < 0 || (max_pairs > 100000 || (max_images < 0 || max_images > 10000))))))) {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidOptions", "limits must be integers within documented hard bounds"), false, 0, undefined);
    }
    const _bind = _M0FP36cjyhjy10visionleak4core5field(j, "images");
    if (_bind.$tag === 5) {
      const _Array = _bind;
      const _raw = _Array._0;
      if (_raw.length > max_images) {
        return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("ImageBudget", "image count exceeds maxImages"), false, 0, undefined);
      }
      const items = [];
      const _bind$2 = [];
      const ids = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$2, 0, 0), undefined);
      const _bind$3 = _raw.length;
      let _tmp$5 = 0;
      while (true) {
        const _ = _tmp$5;
        if (_ < _bind$3) {
          const value = _raw[_];
          const id = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "id"));
          const split = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "split"));
          const bytes = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "byteDigest"));
          const pixels = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "pixelDigest"));
          const hash = _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "dhash"));
          const mirror_hash = include_mirrors ? _M0FP36cjyhjy10visionleak4core4text(_M0FP36cjyhjy10visionleak4core5field(value, "dhashMirror")) : hash;
          const contrast = _M0FP36cjyhjy10visionleak4core7integer(_M0FP36cjyhjy10visionleak4core5field(value, "contrast"));
          if (id === "" || (id.length > 4096 || (split === "" || (split.length > 64 || (!_M0FP36cjyhjy10visionleak4core5hex64(bytes) || (!_M0FP36cjyhjy10visionleak4core5hex64(pixels) || (!_M0FP36cjyhjy10visionleak4core6bits64(hash) || (!_M0FP36cjyhjy10visionleak4core6bits64(mirror_hash) || (contrast < 0 || contrast > 255))))))))) {
            return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "id, split, digests, hash or contrast is invalid"), false, 0, undefined);
          }
          if (_M0MPB3Map8containsGsbE(ids, id)) {
            return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("DuplicateId", "image IDs must be unique"), false, 0, undefined);
          }
          const orientation_hashes = [];
          if (include_rotations) {
            const _bind$4 = _M0FP36cjyhjy10visionleak4core5field(value, "dhashRotations");
            if (_bind$4.$tag === 5) {
              const _Array$2 = _bind$4;
              const _rotated = _Array$2._0;
              if (_rotated.length !== 3) {
                return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "dhashRotations must contain three hashes"), false, 0, undefined);
              }
              const mirrored = _M0FP36cjyhjy10visionleak4core5field(value, "dhashMirrorRotations");
              if (include_mirrors) {
                _L$2: {
                  _L$3: {
                    if (mirrored.$tag === 5) {
                      const _Array$3 = mirrored;
                      const _a = _Array$3._0;
                      if (_a.length === 3) {
                      } else {
                        break _L$3;
                      }
                    } else {
                      break _L$3;
                    }
                    break _L$2;
                  }
                  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "dhashMirrorRotations must contain three hashes"), false, 0, undefined);
                }
              }
              _M0MPC15array5Array4pushGsE(orientation_hashes, _M0FP36cjyhjy10visionleak4core21pack__validated__hash(hash));
              if (include_mirrors) {
                _M0MPC15array5Array4pushGsE(orientation_hashes, _M0FP36cjyhjy10visionleak4core21pack__validated__hash(mirror_hash));
              }
              let _tmp$6 = 0;
              while (true) {
                const i = _tmp$6;
                if (i < 3) {
                  const h = _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_rotated, i));
                  if (!_M0FP36cjyhjy10visionleak4core6bits64(h)) {
                    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "invalid rotated hash"), false, 0, undefined);
                  }
                  _M0MPC15array5Array4pushGsE(orientation_hashes, _M0FP36cjyhjy10visionleak4core21pack__validated__hash(h));
                  if (include_mirrors) {
                    if (mirrored.$tag === 5) {
                      const _Array$3 = mirrored;
                      const _a = _Array$3._0;
                      const mh = _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_a, i));
                      if (!_M0FP36cjyhjy10visionleak4core6bits64(mh)) {
                        return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "invalid reflected rotated hash"), false, 0, undefined);
                      }
                      _M0MPC15array5Array4pushGsE(orientation_hashes, _M0FP36cjyhjy10visionleak4core21pack__validated__hash(mh));
                    }
                  }
                  _tmp$6 = i + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
            } else {
              return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "dhashRotations must contain three hashes"), false, 0, undefined);
            }
          }
          const local_hashes = [];
          const local_contrasts = [];
          if (include_crops) {
            _L$2: {
              _L$3: {
                const _bind$4 = _M0FP36cjyhjy10visionleak4core5field(value, "localHashes");
                if (_bind$4.$tag === 5) {
                  const _Array$2 = _bind$4;
                  const _hs = _Array$2._0;
                  if (_hs.length === 20) {
                    _L$4: {
                      _L$5: {
                        const _bind$5 = _M0FP36cjyhjy10visionleak4core5field(value, "localContrasts");
                        if (_bind$5.$tag === 5) {
                          const _Array$3 = _bind$5;
                          const _cs = _Array$3._0;
                          if (_cs.length === 20) {
                            let _tmp$6 = 0;
                            while (true) {
                              const k = _tmp$6;
                              if (k < 20) {
                                const h = _M0FP36cjyhjy10visionleak4core4text(_M0MPC15array5Array2atGRPB4JsonE(_hs, k));
                                const c = _M0FP36cjyhjy10visionleak4core7integer(_M0MPC15array5Array2atGRPB4JsonE(_cs, k));
                                if (!_M0FP36cjyhjy10visionleak4core6bits64(h) || (c < 0 || c > 255)) {
                                  return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "invalid local hash or contrast"), false, 0, undefined);
                                }
                                _M0MPC15array5Array4pushGsE(local_hashes, _M0FP36cjyhjy10visionleak4core21pack__validated__hash(h));
                                _M0MPC15array5Array4pushGiE(local_contrasts, c);
                                _tmp$6 = k + 1 | 0;
                                continue;
                              } else {
                                break;
                              }
                            }
                          } else {
                            break _L$5;
                          }
                        } else {
                          break _L$5;
                        }
                        break _L$4;
                      }
                      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "localContrasts must contain twenty contrasts"), false, 0, undefined);
                    }
                  } else {
                    break _L$3;
                  }
                } else {
                  break _L$3;
                }
                break _L$2;
              }
              return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidImage", "localHashes must contain twenty hashes"), false, 0, undefined);
            }
          }
          _M0MPB3Map3setGsbE(ids, id, true);
          _M0MPC15array5Array4pushGsE(items, new _M0TP36cjyhjy10visionleak4core4Item(id, split, bytes, pixels, _M0FP36cjyhjy10visionleak4core21pack__validated__hash(hash), _M0FP36cjyhjy10visionleak4core21pack__validated__hash(mirror_hash), orientation_hashes, contrast, local_hashes, local_contrasts));
          _tmp$5 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core10run__audit(items, threshold, max_work, max_pairs, max_images, include_mirrors, include_rotations, include_crops), false, 0, undefined);
    } else {
      return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidInput", "images must be an array"), false, 0, undefined);
    }
  } else {
    return _M0MPC14json4Json17stringify_2einner(_M0FP36cjyhjy10visionleak4core11error__json("InvalidInput", "audit must be an object"), false, 0, undefined);
  }
}
export { _M0FP36cjyhjy10visionleak4core13sha256__final as sha256_final, _M0FP36cjyhjy10visionleak4core11sha256__new as sha256_new, _M0FP36cjyhjy10visionleak4core14sha256__update as sha256_update, _M0FP36cjyhjy10visionleak4core14workflow__json as workflow_json, _M0FP36cjyhjy10visionleak4core20sampling__plan__json as sampling_plan_json, _M0FP36cjyhjy10visionleak4core24review__validation__json as review_validation_json, _M0FP36cjyhjy10visionleak4core22report__identity__json as report_identity_json, _M0FP36cjyhjy10visionleak4core18pixel__digest__new as pixel_digest_new, _M0FP36cjyhjy10visionleak4core27pixel__digest__update__rgba as pixel_digest_update_rgba, _M0FP36cjyhjy10visionleak4core20pixel__digest__final as pixel_digest_final, _M0FP36cjyhjy10visionleak4core11score__json as score_json, _M0FP36cjyhjy10visionleak4core17fingerprint__rgba as fingerprint_rgba, _M0FP36cjyhjy10visionleak4core17fingerprint__json as fingerprint_json, _M0FP36cjyhjy10visionleak4core27fingerprint__mirrored__rgba as fingerprint_mirrored_rgba, _M0FP36cjyhjy10visionleak4core27fingerprint__oriented__rgba as fingerprint_oriented_rgba, _M0FP36cjyhjy10visionleak4core27fingerprint__combined__rgba as fingerprint_combined_rgba, _M0FP36cjyhjy10visionleak4core24fingerprint__local__rgba as fingerprint_local_rgba, _M0FP36cjyhjy10visionleak4core18cli__options__json as cli_options_json, _M0FP36cjyhjy10visionleak4core11audit__json as audit_json }
