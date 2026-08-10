/* ========== 1. ISO-8859-1 Mojibake ========== */
function mojiDecode(){
  var s = document.getElementById('mojiIn').value;
  try {
    var bytes = new Uint8Array(s.length);
    for (var i=0; i<s.length; i++) bytes[i] = s.charCodeAt(i) & 0xFF;
    document.getElementById('mojiOut').textContent = new TextDecoder('utf-8').decode(bytes);
  } catch(e){ document.getElementById('mojiOut').textContent = '解码失败: ' + e.message; }
}
function mojiEncode(){
  var s = document.getElementById('mojiIn').value;
  var bytes = new TextEncoder().encode(s);
  var out = '';
  for (var i=0; i<bytes.length; i++) out += String.fromCharCode(bytes[i]);
  document.getElementById('mojiOut').textContent = out;
}

/* ========== 2. URL Encode/Decode ========== */
function urlEncode(){
  document.getElementById('urlOut').textContent = encodeURIComponent(document.getElementById('urlIn').value);
}
function urlDecode(){
  try {
    document.getElementById('urlOut').textContent = decodeURIComponent(document.getElementById('urlIn').value);
  } catch(e){ document.getElementById('urlOut').textContent = '解码失败: ' + e.message; }
}

/* ========== 3. Base64 ========== */
function b64Encode(){
  try {
    var bytes = new TextEncoder().encode(document.getElementById('b64In').value);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    document.getElementById('b64Out').textContent = btoa(bin);
  } catch(e){ document.getElementById('b64Out').textContent = '编码失败: ' + e.message; }
}
function b64Decode(){
  try {
    var bin = atob(document.getElementById('b64In').value.trim());
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    document.getElementById('b64Out').textContent = new TextDecoder().decode(bytes);
  } catch(e){ document.getElementById('b64Out').textContent = '解码失败 (检查输入是否为有效 Base64)'; }
}

/* ========== 4. Unicode / Chinese ========== */
function uniEncode(){
  var s = document.getElementById('uniIn').value;
  var out = '';
  for (var i=0; i<s.length; i++){
    var c = s.charCodeAt(i);
    if (c > 127) out += '\\u' + ('0000' + c.toString(16)).slice(-4);
    else out += s[i];
  }
  document.getElementById('uniOut').textContent = out;
}
function uniDecode(){
  var s = document.getElementById('uniIn').value;
  s = s.replace(/\\u([0-9a-fA-F]{4})/g, function(_,h){ return String.fromCharCode(parseInt(h,16)); });
  s = s.replace(/&#x([0-9a-fA-F]+);/g, function(_,h){ return String.fromCharCode(parseInt(h,16)); });
  s = s.replace(/&#(\d+);/g, function(_,d){ return String.fromCharCode(parseInt(d,10)); });
  document.getElementById('uniOut').textContent = s;
}

/* ========== 5. IEEE 754 Float ========== */
function floatToHex(){
  var val = parseFloat(document.getElementById('floatDec').value);
  var prec = parseInt(document.getElementById('floatPrec').value);
  var hex = '', detail = '';
  if (isNaN(val)) { document.getElementById('floatHex').value = '无效数值'; return; }
  if (prec === 32){
    var buf = new ArrayBuffer(4); var f = new Float32Array(buf); var u = new Uint32Array(buf);
    f[0] = val;
    hex = u[0].toString(16).toUpperCase().padStart(8,'0');
    var sign = (u[0] >>> 31) & 1;
    var exp = (u[0] >>> 23) & 0xFF;
    var mant = u[0] & 0x7FFFFF;
    detail = '符号: ' + sign + ' | 指数: ' + exp + ' (实际 ' + (exp - 127) + ') | 尾数: 0x' + mant.toString(16).toUpperCase().padStart(6,'0');
  } else {
    var buf = new ArrayBuffer(8); var f = new Float64Array(buf); var u = new BigUint64Array(buf);
    f[0] = val;
    hex = u[0].toString(16).toUpperCase().padStart(16,'0');
    var sign = (u[0] >> 63n) & 1n;
    var exp = (u[0] >> 52n) & 0x7FFn;
    var mant = u[0] & 0xFFFFFFFFFFFFFn;
    detail = '符号: ' + sign + ' | 指数: ' + exp + ' (实际 ' + (Number(exp) - 1023) + ') | 尾数: 0x' + mant.toString(16).toUpperCase().padStart(13,'0');
  }
  document.getElementById('floatHex').value = hex;
  document.getElementById('floatDetail').textContent = detail;
}
function hexToFloat(){
  var hexStr = document.getElementById('floatHex').value.replace(/\s/g,'');
  var prec = parseInt(document.getElementById('floatPrec').value);
  try {
    if (prec === 32){
      var buf = new ArrayBuffer(4); var f = new Float32Array(buf); var u = new Uint32Array(buf);
      u[0] = parseInt(hexStr, 16);
      document.getElementById('floatDec').value = f[0];
    } else {
      var buf = new ArrayBuffer(8); var f = new Float64Array(buf); var u = new BigUint64Array(buf);
      u[0] = BigInt('0x' + hexStr);
      document.getElementById('floatDec').value = f[0];
    }
  } catch(e){ document.getElementById('floatDec').value = '无效十六进制'; }
}

/* ========== 6. Base Conversion ========== */
function baseConvert(){
  var fromBase = parseInt(document.getElementById('baseFrom').value);
  var valStr = document.getElementById('baseIn').value.trim();
  var num;
  try { num = parseInt(valStr, fromBase); } catch(e){ return; }
  if (isNaN(num)) { clearBaseResults(); return; }
  document.getElementById('base2').textContent = num.toString(2);
  document.getElementById('base8').textContent = num.toString(8);
  document.getElementById('base10').textContent = num.toString(10);
  document.getElementById('base16').textContent = num.toString(16).toUpperCase();
}
function clearBaseResults(){
  document.getElementById('base2').textContent =
  document.getElementById('base8').textContent =
  document.getElementById('base10').textContent =
  document.getElementById('base16').textContent = '';
}

/* ========== 7. Signed Number ========== */
function calcSigned(){
  var val = parseInt(document.getElementById('signedVal').value) || 0;
  var bits = parseInt(document.getElementById('signedBits').value);
  var range = Math.pow(2, bits - 1);
  if (val < -range || val >= range) {
    document.getElementById('smResult').textContent = '超出 ' + bits + '-bit 范围 (' + (-range) + ' ~ ' + (range - 1) + ')';
    document.getElementById('ocResult').textContent = document.getElementById('tcResult').textContent = '';
    return;
  }
  var mask = bits === 32 ? 0xFFFFFFFF : Math.pow(2, bits) - 1;
  var twos = val & mask;
  var hexLen = Math.ceil(bits / 4);
  document.getElementById('tcResult').textContent = twos.toString(2).padStart(bits,'0') + ' (0x' + (twos >>> 0).toString(16).toUpperCase().padStart(hexLen,'0') + ')';

  var ones;
  if (val < 0) ones = (~Math.abs(val)) & mask;
  else ones = val & mask;
  document.getElementById('ocResult').textContent = ones.toString(2).padStart(bits,'0') + ' (0x' + (ones >>> 0).toString(16).toUpperCase().padStart(hexLen,'0') + ')';

  var sm;
  if (val < 0) sm = range | (Math.abs(val) & (range - 1));
  else sm = val;
  document.getElementById('smResult').textContent = sm.toString(2).padStart(bits,'0') + ' (0x' + (sm >>> 0).toString(16).toUpperCase().padStart(hexLen,'0') + ')';
}

/* ========== 8. chmod ========== */
function chmodUpdate(){
  var n = 0, sym = '';
  for (var g=0; g<3; g++){
    var r = document.getElementById('cr'+g).checked ? 4 : 0;
    var w = document.getElementById('cw'+g).checked ? 2 : 0;
    var x = document.getElementById('cx'+g).checked ? 1 : 0;
    var v = r + w + x;
    n = n * 8 + v;
    sym += (r?'r':'-') + (w?'w':'-') + (x?'x':'-');
  }
  document.getElementById('chmodNum').value = n.toString(8).padStart(3,'0');
  document.getElementById('chmodSym').textContent = sym;
}
function chmodFromNum(){
  var s = document.getElementById('chmodNum').value.replace(/\D/g,'');
  if (s.length > 3) s = s.slice(0,3);
  var n = parseInt(s, 8);
  if (isNaN(n) || n<0 || n>511) { document.getElementById('chmodSym').textContent = '---'; return; }
  for (var g=0; g<3; g++){
    var v = (n >> ((2-g)*3)) & 7;
    document.getElementById('cr'+g).checked = !!(v & 4);
    document.getElementById('cw'+g).checked = !!(v & 2);
    document.getElementById('cx'+g).checked = !!(v & 1);
  }
  chmodUpdate();
}

/* ========== 9. PPI ========== */
function calcPPI(){
  var w = parseInt(document.getElementById('ppiW').value) || 0;
  var h = parseInt(document.getElementById('ppiH').value) || 0;
  var d = parseFloat(document.getElementById('ppiSize').value) || 0;
  if (!w||!h||!d) { document.getElementById('ppiResult').textContent = '请填写所有参数'; return; }
  var diagPx = Math.sqrt(w*w + h*h);
  var ppi = diagPx / d;
  document.getElementById('ppiResult').textContent =
    '对角线像素: ' + diagPx.toFixed(0) + ' px\n' +
    'PPI: ' + ppi.toFixed(2) + ' ppi\n' +
    'DPI (打印): ' + ppi.toFixed(2) + ' dpi\n' +
    '点距: ' + (25.4 / ppi).toFixed(4) + ' mm';
}

/* ========== 10. IPv4 to IPv6 ========== */
function ipv4to6(){
  var ip = document.getElementById('ipv4In').value.trim();
  var parts = ip.split('.');
  if (parts.length !== 4 || parts.some(function(p){ var n=parseInt(p); return isNaN(n)||n<0||n>255; })) {
    document.getElementById('ipv6Out').textContent = '无效 IPv4 地址';
    document.getElementById('ipv6Full').textContent = '';
    return;
  }
  var hex = parts.map(function(p){ return ('0' + parseInt(p).toString(16)).slice(-2); });
  document.getElementById('ipv6Out').textContent = '::ffff:' + hex[0]+hex[1] + ':' + hex[2]+hex[3];
  document.getElementById('ipv6Full').textContent = '0000:0000:0000:0000:0000:ffff:' + hex[0]+hex[1] + ':' + hex[2]+hex[3];
}

/* ========== 11. RMB Uppercase ========== */
function rmbConvert(){
  var s = document.getElementById('rmbIn').value.replace(/[^\d.\-]/g,'');
  if (!s) { document.getElementById('rmbOut').textContent = '请输入有效金额'; return; }
  var num = parseFloat(s);
  if (isNaN(num)) { document.getElementById('rmbOut').textContent = '无效金额'; return; }
  var digits = '零壹贰叁肆伍陆柒捌玖';
  var units = ['','拾','佰','仟'];
  var bigUnits = ['','万','亿','兆'];
  var decUnits = ['角','分'];

  function convertInteger(n){
    if (n === 0) return '零';
    var str = n.toString();
    var len = str.length;
    var result = '';
    var zeroFlag = false;
    for (var i = 0; i < len; i++){
      var digit = parseInt(str[i]);
      var pos = len - 1 - i;
      var unitIdx = pos % 4;
      var bigIdx = Math.floor(pos / 4);
      if (digit === 0){
        zeroFlag = true;
        if (unitIdx === 0) result += bigUnits[bigIdx];
      } else {
        if (zeroFlag) { result += '零'; zeroFlag = false; }
        result += digits[digit] + units[unitIdx];
        if (unitIdx === 0) result += bigUnits[bigIdx];
      }
    }
    return result;
  }

  var negative = num < 0;
  num = Math.abs(num);
  var intPart = Math.floor(num);
  var decPart = Math.round((num - intPart) * 100);

  var out = '';
  if (negative) out += '负';
  out += convertInteger(intPart) + '元';
  if (decPart === 0){
    out += '整';
  } else {
    var jiao = Math.floor(decPart / 10);
    var fen = decPart % 10;
    if (jiao > 0) out += digits[jiao] + '角';
    else out += '零';
    if (fen > 0) out += digits[fen] + '分';
  }
  document.getElementById('rmbOut').textContent = out;
}

/* ========== 12. Unit Conversion ========== */
var unitData = {
  length: { units: ['米 (m)','千米 (km)','厘米 (cm)','毫米 (mm)','英寸 (in)','英尺 (ft)','码 (yd)','英里 (mi)','海里 (nmi)'],
    toBase: [1, 1000, 0.01, 0.001, 0.0254, 0.3048, 0.9144, 1609.344, 1852] },
  weight: { units: ['千克 (kg)','克 (g)','毫克 (mg)','吨 (t)','磅 (lb)','盎司 (oz)'],
    toBase: [1, 0.001, 1e-6, 1000, 0.45359237, 0.028349523125] },
  temp: { units: ['摄氏度 (°C)','华氏度 (°F)','开尔文 (K)'], toBase: null },
  area: { units: ['平方米 (m²)','平方千米 (km²)','公顷 (ha)','英亩 (acre)','平方英尺 (ft²)'],
    toBase: [1, 1e6, 10000, 4046.8564224, 0.09290304] },
  volume: { units: ['升 (L)','毫升 (mL)','立方米 (m³)','美制加仑 (gal)','美制夸脱 (qt)'],
    toBase: [1, 0.001, 1000, 3.785411784, 0.946352946] },
  speed: { units: ['米/秒 (m/s)','千米/时 (km/h)','英里/时 (mph)','节 (kn)'],
    toBase: [1, 1/3.6, 0.44704, 0.514444] }
};

function unitCatChange(){
  var cat = document.getElementById('unitCat').value;
  var data = unitData[cat];
  var from = document.getElementById('unitFrom');
  var to = document.getElementById('unitTo');
  from.innerHTML = ''; to.innerHTML = '';
  data.units.forEach(function(u,i){
    from.innerHTML += '<option value="'+i+'">'+u+'</option>';
    to.innerHTML += '<option value="'+i+'">'+u+'</option>';
  });
  to.selectedIndex = Math.min(1, data.units.length - 1);
  unitConvert();
}

function unitConvert(){
  var cat = document.getElementById('unitCat').value;
  var data = unitData[cat];
  var val = parseFloat(document.getElementById('unitVal').value);
  var fromIdx = parseInt(document.getElementById('unitFrom').value);
  var toIdx = parseInt(document.getElementById('unitTo').value);
  if (isNaN(val)) { document.getElementById('unitResult').textContent = ''; return; }

  var result;
  if (cat === 'temp'){
    if (fromIdx === 0 && toIdx === 1) result = val * 9/5 + 32;
    else if (fromIdx === 0 && toIdx === 2) result = val + 273.15;
    else if (fromIdx === 1 && toIdx === 0) result = (val - 32) * 5/9;
    else if (fromIdx === 1 && toIdx === 2) result = (val - 32) * 5/9 + 273.15;
    else if (fromIdx === 2 && toIdx === 0) result = val - 273.15;
    else if (fromIdx === 2 && toIdx === 1) result = (val - 273.15) * 9/5 + 32;
    else result = val;
  } else {
    result = val * data.toBase[fromIdx] / data.toBase[toIdx];
  }
  document.getElementById('unitResult').textContent = val + ' = ' + result.toPrecision(10) + ' ' + data.units[toIdx];
}

document.getElementById('unitVal').addEventListener('input', unitConvert);
document.getElementById('unitFrom').addEventListener('change', unitConvert);
document.getElementById('unitTo').addEventListener('change', unitConvert);
unitCatChange();

/* ========== 13. MD5 (pure JS) ========== */
function md5(s){
  function rotateLeft(x, n){ return (x << n) | (x >>> (32 - n)); }
  function addUnsigned(x, y){
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function F(x,y,z){ return (x & y) | (~x & z); }
  function G(x,y,z){ return (x & z) | (y & ~z); }
  function H(x,y,z){ return x ^ y ^ z; }
  function I(x,y,z){ return y ^ (x | ~z); }
  function FF(a,b,c,d,x,s,ac){ a = addUnsigned(a, addUnsigned(addUnsigned(F(b,c,d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function GG(a,b,c,d,x,s,ac){ a = addUnsigned(a, addUnsigned(addUnsigned(G(b,c,d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function HH(a,b,c,d,x,s,ac){ a = addUnsigned(a, addUnsigned(addUnsigned(H(b,c,d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function II(a,b,c,d,x,s,ac){ a = addUnsigned(a, addUnsigned(addUnsigned(I(b,c,d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }

  // 先按 UTF-8 编码，保证中文等非 ASCII 字符与标准 MD5 结果一致
  var bytes = Array.from(new TextEncoder().encode(s));
  var len = bytes.length;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  // 64 位原始字节长度（低位 + 高位）
  var bitLow = (len * 8) >>> 0;
  var bitHigh = Math.floor(len / 0x20000000);
  for (var i = 0; i < 4; i++) bytes.push((bitLow >>> (i * 8)) & 0xFF);
  for (var i = 0; i < 4; i++) bytes.push((bitHigh >>> (i * 8)) & 0xFF);

  var a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

  for (var i = 0; i < bytes.length; i += 64){
    var X = [];
    for (var j = 0; j < 16; j++){
      X[j] = bytes[i+j*4] | (bytes[i+j*4+1] << 8) | (bytes[i+j*4+2] << 16) | (bytes[i+j*4+3] << 24);
    }
    var A = a, B = b, C = c, D = d;
    a = FF(a,b,c,d,X[0],7,0xD76AA478); d = FF(d,a,b,c,X[1],12,0xE8C7B756); c = FF(c,d,a,b,X[2],17,0x242070DB); b = FF(b,c,d,a,X[3],22,0xC1BDCEEE);
    a = FF(a,b,c,d,X[4],7,0xF57C0FAF); d = FF(d,a,b,c,X[5],12,0x4787C62A); c = FF(c,d,a,b,X[6],17,0xA8304613); b = FF(b,c,d,a,X[7],22,0xFD469501);
    a = FF(a,b,c,d,X[8],7,0x698098D8); d = FF(d,a,b,c,X[9],12,0x8B44F7AF); c = FF(c,d,a,b,X[10],17,0xFFFF5BB1); b = FF(b,c,d,a,X[11],22,0x895CD7BE);
    a = FF(a,b,c,d,X[12],7,0x6B901122); d = FF(d,a,b,c,X[13],12,0xFD987193); c = FF(c,d,a,b,X[14],17,0xA679438E); b = FF(b,c,d,a,X[15],22,0x49B40821);
    a = GG(a,b,c,d,X[1],5,0xF61E2562); d = GG(d,a,b,c,X[6],9,0xC040B340); c = GG(c,d,a,b,X[11],14,0x265E5A51); b = GG(b,c,d,a,X[0],20,0xE9B6C7AA);
    a = GG(a,b,c,d,X[5],5,0xD62F105D); d = GG(d,a,b,c,X[10],9,0x2441453); c = GG(c,d,a,b,X[15],14,0xD8A1E681); b = GG(b,c,d,a,X[4],20,0xE7D3FBC8);
    a = GG(a,b,c,d,X[9],5,0x21E1CDE6); d = GG(d,a,b,c,X[14],9,0xC33707D6); c = GG(c,d,a,b,X[3],14,0xF4D50D87); b = GG(b,c,d,a,X[8],20,0x455A14ED);
    a = GG(a,b,c,d,X[13],5,0xA9E3E905); d = GG(d,a,b,c,X[2],9,0xFCEFA3F8); c = GG(c,d,a,b,X[7],14,0x676F02D9); b = GG(b,c,d,a,X[12],20,0x8D2A4C8A);
    a = HH(a,b,c,d,X[5],4,0xFFFA3942); d = HH(d,a,b,c,X[8],11,0x8771F681); c = HH(c,d,a,b,X[11],16,0x6D9D6122); b = HH(b,c,d,a,X[14],23,0xFDE5380C);
    a = HH(a,b,c,d,X[1],4,0xA4BEEA44); d = HH(d,a,b,c,X[4],11,0x4BDECFA9); c = HH(c,d,a,b,X[7],16,0xF6BB4B60); b = HH(b,c,d,a,X[10],23,0xBEBFBC70);
    a = HH(a,b,c,d,X[13],4,0x289B7EC6); d = HH(d,a,b,c,X[0],11,0xEAA127FA); c = HH(c,d,a,b,X[3],16,0xD4EF3085); b = HH(b,c,d,a,X[6],23,0x4881D05);
    a = HH(a,b,c,d,X[9],4,0xD9D4D039); d = HH(d,a,b,c,X[12],11,0xE6DB99E5); c = HH(c,d,a,b,X[15],16,0x1FA27CF8); b = HH(b,c,d,a,X[2],23,0xC4AC5665);
    a = II(a,b,c,d,X[0],6,0xF4292244); d = II(d,a,b,c,X[7],10,0x432AFF97); c = II(c,d,a,b,X[14],15,0xAB9423A7); b = II(b,c,d,a,X[5],21,0xFC93A039);
    a = II(a,b,c,d,X[12],6,0x655B59C3); d = II(d,a,b,c,X[3],10,0x8F0CCC92); c = II(c,d,a,b,X[10],15,0xFFEFF47D); b = II(b,c,d,a,X[1],21,0x85845DD1);
    a = II(a,b,c,d,X[8],6,0x6FA87E4F); d = II(d,a,b,c,X[15],10,0xFE2CE6E0); c = II(c,d,a,b,X[6],15,0xA3014314); b = II(b,c,d,a,X[13],21,0x4E0811A1);
    a = II(a,b,c,d,X[4],6,0xF7537E82); d = II(d,a,b,c,X[11],10,0xBD3AF235); c = II(c,d,a,b,X[2],15,0x2AD7D2BB); b = II(b,c,d,a,X[9],21,0xEB86D391);
    a = addUnsigned(a, A); b = addUnsigned(b, B); c = addUnsigned(c, C); d = addUnsigned(d, D);
  }

  // MD5 约定按小端输出每个 32 位字（低字节在前）
  function wordToHex(w){
    var h = '';
    for (var i = 0; i < 4; i++) h += ('0' + ((w >>> (i * 8)) & 0xFF).toString(16)).slice(-2);
    return h;
  }
  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

function calcMD5(){
  var inp = document.getElementById('md5In').value;
  var hash = md5(inp);
  document.getElementById('md5Lower').textContent = hash;
  document.getElementById('md5Upper').textContent = hash.toUpperCase();
}

/* ========== 14. SHA-256 (pure JS) ========== */
function sha256(s){
  var bytes = Array.from(new TextEncoder().encode(s));
  var bitLen = BigInt(bytes.length) * 8n;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (var i = 7; i >= 0; i--) bytes.push(Number((bitLen >> BigInt(i * 8)) & 0xFFn));

  var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
           0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
           0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
           0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
           0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
           0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
           0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
           0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];

  var H0=0x6a09e667,H1=0xbb67ae85,H2=0x3c6ef372,H3=0xa54ff53a,H4=0x510e527f,H5=0x9b05688c,H6=0x1f83d9ab,H7=0x5be0cd19;
  var w = new Array(64);
  function rotr(x, n){ return (x >>> n) | (x << (32 - n)); }

  for (var i = 0; i < bytes.length; i += 64){
    for (var j = 0; j < 16; j++){
      w[j] = (bytes[i + j*4] << 24) | (bytes[i + j*4 + 1] << 16) | (bytes[i + j*4 + 2] << 8) | bytes[i + j*4 + 3];
    }
    for (var j = 16; j < 64; j++){
      var s0 = rotr(w[j-15], 7) ^ rotr(w[j-15], 18) ^ (w[j-15] >>> 3);
      var s1 = rotr(w[j-2], 17) ^ rotr(w[j-2], 19) ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
    }
    var a=H0, b=H1, c=H2, d=H3, e=H4, f=H5, g=H6, h=H7;
    for (var j = 0; j < 64; j++){
      var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      var ch = (e & f) ^ (~e & g);
      var t1 = (h + S1 + ch + K[j] + w[j]) | 0;
      var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var t2 = (S0 + maj) | 0;
      h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    H0=(H0+a)|0; H1=(H1+b)|0; H2=(H2+c)|0; H3=(H3+d)|0;
    H4=(H4+e)|0; H5=(H5+f)|0; H6=(H6+g)|0; H7=(H7+h)|0;
  }
  return [H0,H1,H2,H3,H4,H5,H6,H7].map(function(x){ return (x >>> 0).toString(16).padStart(8, '0'); }).join('');
}

function calcSHA(){
  var s = document.getElementById('shaIn').value;
  document.getElementById('shaOut').textContent = sha256(s);
}

/* ========== 15. Password Generator ========== */
function genPassword(){
  var len = parseInt(document.getElementById('pwdLen').value, 10) || 16;
  len = Math.max(4, Math.min(64, len));
  var sets = [];
  if (document.getElementById('pwdUpper').checked) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (document.getElementById('pwdLower').checked) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (document.getElementById('pwdDigit').checked) sets.push('0123456789');
  if (document.getElementById('pwdSymbol').checked) sets.push('!@#$%^&*()-_=+[]{};:,.<>?/');
  if (!sets.length) sets.push('abcdefghijklmnopqrstuvwxyz', '0123456789');
  var all = sets.join('');
  var chars = [];
  // 保证每个选中的字符集至少出现一次
  for (var i = 0; i < sets.length; i++) chars.push(sets[i][Math.floor(Math.random() * sets[i].length)]);
  for (var i = chars.length; i < len; i++) chars.push(all[Math.floor(Math.random() * all.length)]);
  // Fisher-Yates 洗牌
  for (var i = chars.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var t = chars[i]; chars[i] = chars[j]; chars[j] = t;
  }
  var pool = sets.reduce(function(n, s){ return n + s.length; }, 0);
  var entropy = Math.round(len * Math.log2(pool));
  var strength = entropy < 50 ? '弱' : entropy < 80 ? '中' : entropy < 120 ? '强' : '极强';
  document.getElementById('pwdOut').textContent = chars.join('');
  document.getElementById('pwdStrength').textContent =
    '长度 ' + len + ' | 字符池 ' + pool + ' | 估算熵 ' + entropy + ' bit（' + strength + '）';
}

/* ========== 16. Timestamp Converter ========== */
function tsToDate(){
  var v = document.getElementById('tsIn').value.trim();
  var out = document.getElementById('tsDateOut');
  if (!/^-?\d+(\.\d+)?$/.test(v)){ out.textContent = '请输入数字时间戳'; return; }
  var ms = parseFloat(v);
  if (Math.abs(ms) < 1e12) ms *= 1000; // 秒 → 毫秒
  var d = new Date(ms);
  if (isNaN(d.getTime())){ out.textContent = '无效时间戳'; return; }
  out.textContent = '本地: ' + d.toLocaleString('zh-CN', { hour12: false }) +
    '\nUTC : ' + d.toUTCString() +
    '\nISO : ' + d.toISOString();
}

function dateToTs(){
  var v = document.getElementById('dateIn').value;
  var out = document.getElementById('tsOut');
  if (!v){ out.textContent = '请选择日期时间'; return; }
  var ms = new Date(v).getTime();
  out.textContent = '秒: ' + Math.floor(ms / 1000) + '\n毫秒: ' + ms;
}

/* ========== 17. JSON Formatter ========== */
function jsonPretty(){
  var raw = document.getElementById('jsonIn').value;
  try { document.getElementById('jsonOut').textContent = JSON.stringify(JSON.parse(raw), null, 2); }
  catch(e){ document.getElementById('jsonOut').textContent = '解析失败: ' + e.message; }
}

function jsonMinify(){
  var raw = document.getElementById('jsonIn').value;
  try { document.getElementById('jsonOut').textContent = JSON.stringify(JSON.parse(raw)); }
  catch(e){ document.getElementById('jsonOut').textContent = '解析失败: ' + e.message; }
}

function jsonValidate(){
  var raw = document.getElementById('jsonIn').value;
  try { JSON.parse(raw); document.getElementById('jsonOut').textContent = '✅ 合法 JSON'; }
  catch(e){ document.getElementById('jsonOut').textContent = '❌ 解析失败: ' + e.message; }
}

/* ========== 18. Text Stats ========== */
function textStats(){
  var s = document.getElementById('statIn').value;
  var noSpace = s.replace(/\s/g, '');
  var cjk = (s.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  var words = s.trim() ? s.trim().split(/\s+/).length : 0;
  var lines = s ? s.split('\n').length : 0;
  var paras = s.trim() ? s.trim().split(/\n\s*\n/).length : 0;
  var bytes = new TextEncoder().encode(s).length;
  document.getElementById('statOut').textContent =
    '字符数: ' + s.length + ' | 不含空白: ' + noSpace.length +
    '\n中文字符: ' + cjk + ' | 单词数: ' + words +
    '\n行数: ' + lines + ' | 段落数: ' + paras +
    '\nUTF-8 字节数: ' + bytes;
}

/* ========== 19. Color Converter ========== */
function rgbToHsl(r, g, b){
  r /= 255; g /= 255; b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h = 0, s = 0, l = (max + min) / 2;
  if (max !== min){
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l){
  h = ((h % 360) + 360) % 360 / 360;
  s /= 100; l /= 100;
  function hue2rgb(p, q, t){
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
  var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  var p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1/3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1/3) * 255)];
}

function colorConvert(){
  var v = document.getElementById('colorText').value.trim();
  var out = document.getElementById('colorOut');
  var preview = document.getElementById('colorPreview');
  var r, g, b;
  var m = v.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m){
    var h = m[1];
    if (h.length === 3) h = h.replace(/./g, function(c){ return c + c; });
    r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
  } else {
    var m2 = v.match(/^rgba?\(([^)]+)\)$/i);
    if (m2){
      var p = m2[1].split(',');
      r = parseInt(p[0].trim(), 10); g = parseInt(p[1].trim(), 10); b = parseInt(p[2].trim(), 10);
    } else {
      var m3 = v.match(/^hsla?\(([^)]+)\)$/i);
      if (m3){
        var p = m3[1].split(',');
        var rgb = hslToRgb(parseFloat(p[0].trim()), parseFloat(p[1].trim()), parseFloat(p[2].trim()));
        r = rgb[0]; g = rgb[1]; b = rgb[2];
      }
    }
  }
  if (r === undefined || isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255){
    out.textContent = '无法解析的颜色（支持 #RGB / #RRGGBB / rgb() / hsl()）';
    preview.style.background = 'transparent';
    return;
  }
  var hex = '#' + [r, g, b].map(function(x){ return ('0' + x.toString(16)).slice(-2); }).join('');
  var hsl = rgbToHsl(r, g, b);
  document.getElementById('colorPicker').value = hex;
  out.textContent = 'HEX: ' + hex.toUpperCase() +
    '\nRGB: rgb(' + r + ', ' + g + ', ' + b + ')' +
    '\nHSL: hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
  preview.style.background = hex;
}

document.getElementById('colorPicker').addEventListener('input', function(){
  document.getElementById('colorText').value = this.value;
  colorConvert();
});
colorConvert();

/* ========== 20. Regex Tester ========== */
function reTest(){
  var pattern = document.getElementById('reIn').value;
  var flags = document.getElementById('reFlags').value.trim();
  var text = document.getElementById('reText').value;
  var out = document.getElementById('reOut');
  var re;
  try { re = new RegExp(pattern, flags); }
  catch(e){ out.textContent = '正则表达式错误: ' + e.message; return; }
  var matches = [];
  var m, count = 0;
  if (flags.indexOf('g') === -1){
    m = re.exec(text);
    if (m){ matches.push(m[0]); count = 1; }
  } else {
    while ((m = re.exec(text)) !== null){
      matches.push(m[0]);
      count++;
      if (m.index === re.lastIndex) re.lastIndex++;
      if (count >= 200){ matches.push('…（已截断，最多显示 200 条）'); break; }
    }
  }
  var res = '匹配次数: ' + count + (count ? '\n' : '');
  for (var i = 0; i < matches.length; i++) res += (i + 1) + '. ' + matches[i] + '\n';
  out.textContent = res.trim();
}

/* ========== 21. Random Numbers ========== */
function randGen(){
  var min = parseFloat(document.getElementById('randMin').value);
  var max = parseFloat(document.getElementById('randMax').value);
  var count = parseInt(document.getElementById('randCount').value, 10);
  var isInt = document.getElementById('randInt').checked;
  var unique = document.getElementById('randUnique').checked;
  var out = document.getElementById('randOut');
  if (isNaN(min) || isNaN(max) || isNaN(count)){ out.textContent = '请输入有效的参数'; return; }
  if (max < min){ out.textContent = '最大值不能小于最小值'; return; }
  count = Math.max(1, Math.min(1000, count));
  var vals = [];
  if (isInt){
    min = Math.ceil(min); max = Math.floor(max);
    var range = max - min + 1;
    if (range <= 0){ out.textContent = '整数范围为空'; return; }
    if (unique && count > range){ out.textContent = '不重复整数数量超出范围（可用 ' + range + ' 个）'; return; }
    if (unique){
      var pool = [];
      for (var i = min; i <= max; i++) pool.push(i);
      for (var i = pool.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      vals = pool.slice(0, count);
    } else {
      for (var i = 0; i < count; i++) vals.push(min + Math.floor(Math.random() * range));
    }
  } else {
    for (var i = 0; i < count; i++) vals.push(parseFloat((min + Math.random() * (max - min)).toFixed(6)));
  }
  out.textContent = vals.join(', ');
}

/* ========== 22. UUID v4 ========== */
function uuidv4(){
  var bytes = new Uint8Array(16);
  if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (var i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  var hex = Array.from(bytes, function(b){ return ('0' + b.toString(16)).slice(-2); });
  return hex[0]+hex[1]+hex[2]+hex[3] + '-' + hex[4]+hex[5] + '-' + hex[6]+hex[7] + '-' + hex[8]+hex[9] + '-' + hex[10]+hex[11]+hex[12]+hex[13]+hex[14]+hex[15];
}

function uuidGen(){
  var n = parseInt(document.getElementById('uuidCount').value, 10) || 1;
  n = Math.max(1, Math.min(20, n));
  var out = [];
  for (var i = 0; i < n; i++) out.push(uuidv4());
  document.getElementById('uuidOut').textContent = out.join('\n');
}

/* ========== 23. CRC32 ========== */
var crcTable = null;
function crc32(s){
  var bytes = new TextEncoder().encode(s);
  if (!crcTable){
    crcTable = new Array(256);
    for (var n = 0; n < 256; n++){
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      crcTable[n] = c >>> 0;
    }
  }
  var crc = 0xFFFFFFFF;
  for (var i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function calcCRC(){
  var v = crc32(document.getElementById('crcIn').value);
  document.getElementById('crcOut').textContent = '0x' + v.toString(16).toUpperCase().padStart(8, '0') + ' | 十进制: ' + v;
}

/* ========== 24. Variable Naming Convention ========== */
function nameConv(){
  var ids = ['nameCamel','namePascal','nameSnake','nameScream','nameKebab'];
  var s = document.getElementById('nameIn').value.trim();
  if (!s){ ids.forEach(function(id){ document.getElementById(id).textContent = ''; }); return; }
  var parts = [];
  s.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
   .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
   .split(/[^A-Za-z0-9]+/)
   .forEach(function(w){ if (w) parts.push(w.toLowerCase()); });
  if (!parts.length){ ids.forEach(function(id){ document.getElementById(id).textContent = ''; }); return; }
  var cap = function(p){ return p.charAt(0).toUpperCase() + p.slice(1); };
  document.getElementById('nameCamel').textContent = parts[0] + parts.slice(1).map(cap).join('');
  document.getElementById('namePascal').textContent = parts.map(cap).join('');
  document.getElementById('nameSnake').textContent = parts.join('_');
  document.getElementById('nameScream').textContent = parts.join('_').toUpperCase();
  document.getElementById('nameKebab').textContent = parts.join('-');
}

/* ========== 25. Line Processing ========== */
function linesProcess(mode){
  var lines = document.getElementById('linesIn').value.split('\n');
  switch (mode){
    case 'empty': lines = lines.filter(function(l){ return l.trim() !== ''; }); break;
    case 'dedup': lines = lines.filter(function(l, i){ return l.trim() !== '' && lines.indexOf(l) === i; }); break;
    case 'sort': lines.sort(); break;
    case 'sortdesc': lines.sort().reverse(); break;
    case 'reverse': lines.reverse(); break;
  }
  document.getElementById('linesOut').value = lines.join('\n');
}

/* ========== 26. HTML Entities ========== */
function htmlEncode(){
  var s = document.getElementById('htmlIn').value;
  document.getElementById('htmlOut').value = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function htmlDecode(){
  var s = document.getElementById('htmlIn').value;
  var el = document.createElement('textarea');
  el.innerHTML = s;
  document.getElementById('htmlOut').value = el.value;
}

/* ========== 27. Morse Code ========== */
var morseMap = { 'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--','?':'..--..',"'":'.----.','!':'-.-.--','/':'-..-.','(':'-.--.',')':'-.--.-','&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-','"':'.-..-.','$':'...-..-','@':'.--.-.' };

function morseEncode(){
  var s = document.getElementById('morseIn').value.toUpperCase();
  var words = [];
  s.split(/\s+/).forEach(function(w){
    if (!w) return;
    var codes = [];
    for (var i = 0; i < w.length; i++) codes.push(morseMap[w[i]] || '?');
    words.push(codes.join(' '));
  });
  document.getElementById('morseOut').textContent = words.join(' / ');
}

function morseDecode(){
  var rev = {};
  for (var k in morseMap) rev[morseMap[k]] = k;
  var s = document.getElementById('morseIn').value.trim();
  var words = [];
  s.split(/\s*\/\s*|\s{3,}/).forEach(function(w){
    if (!w.trim()) return;
    var chars = [];
    w.trim().split(/\s+/).forEach(function(code){ chars.push(rev[code] || '?'); });
    words.push(chars.join(''));
  });
  document.getElementById('morseOut').textContent = words.join(' ');
}

/* ========== 28. Chinese ID Card Check ========== */
var provinceCodes = {11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门'};

function idCheck(){
  var s = document.getElementById('idCard').value.trim();
  var out = document.getElementById('idOut');
  if (!/^\d{17}[\dXx]$/.test(s)){ out.textContent = '格式无效：需要 18 位数字（最后一位可为 X）'; return; }
  var province = provinceCodes[parseInt(s.slice(0, 2), 10)];
  if (!province){ out.textContent = '无效地区码: ' + s.slice(0, 2); return; }
  var y = parseInt(s.slice(6, 10), 10), mo = parseInt(s.slice(10, 12), 10), d = parseInt(s.slice(12, 14), 10);
  var dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d){ out.textContent = '无效出生日期: ' + s.slice(6, 14); return; }
  var weights = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
  var codes = '10X98765432';
  var sum = 0;
  for (var i = 0; i < 17; i++) sum += parseInt(s.charAt(i), 10) * weights[i];
  var expected = codes[sum % 11];
  var ok = expected === s.charAt(17).toUpperCase();
  var gender = (parseInt(s.charAt(16), 10) % 2 === 1) ? '男' : '女';
  var now = new Date();
  var age = now.getFullYear() - y - ((now.getMonth() + 1 > mo || (now.getMonth() + 1 === mo && now.getDate() >= d)) ? 0 : 1);
  out.textContent =
    (ok ? '✅ 校验位正确' : '❌ 校验位错误（应为 ' + expected + '）') +
    '\n地区: ' + province + '（' + s.slice(0, 6) + '）' +
    '\n出生日期: ' + y + ' 年 ' + mo + ' 月 ' + d + ' 日' +
    '\n性别: ' + gender + ' | 年龄: ' + age + ' 岁';
}

/* ========== 29. Prime Factorization ========== */
function factorize(){
  var n = parseInt(document.getElementById('primeIn').value, 10);
  var out = document.getElementById('primeOut');
  if (isNaN(n)){ out.textContent = '请输入有效整数'; return; }
  if (n < 2){ out.textContent = '请输入 ≥ 2 的整数'; return; }
  if (n > 1000000000000){ out.textContent = '数值过大，暂只支持 ≤ 1,000,000,000,000'; return; }
  var remaining = n;
  var factors = [];
  var d = 2;
  while (d * d <= remaining){
    while (remaining % d === 0){ factors.push(d); remaining /= d; }
    d = d === 2 ? 3 : d + 2;
  }
  if (remaining > 1) factors.push(remaining);
  var groups = [];
  factors.forEach(function(f){
    var last = groups[groups.length - 1];
    if (last && last[0] === f) last[1]++;
    else groups.push([f, 1]);
  });
  var isPrime = groups.length === 1 && groups[0][1] === 1;
  var divisors = 1;
  groups.forEach(function(g){ divisors *= (g[1] + 1); });
  out.textContent =
    (isPrime ? '✅ ' : '') + n + ' = ' + groups.map(function(g){ return g[1] === 1 ? g[0] : g[0] + '^' + g[1]; }).join(' × ') +
    '\n素数: ' + (isPrime ? '是' : '否') +
    '\n质因数个数: ' + factors.length + ' | 约数个数: ' + divisors;
}

/* ========== 30. GCD / LCM ========== */
function gcdCalc(){
  var a = parseInt(document.getElementById('gcdA').value, 10);
  var b = parseInt(document.getElementById('gcdB').value, 10);
  var out = document.getElementById('gcdOut');
  if (isNaN(a) || isNaN(b)){ out.textContent = '请输入两个整数'; return; }
  a = Math.abs(a); b = Math.abs(b);
  if (a === 0 && b === 0){ out.textContent = '两个数不能同时为 0'; return; }
  function gcd(x, y){ while (y){ var t = y; y = x % y; x = t; } return x; }
  var g = gcd(a, b);
  var l = (a / g) * b;
  out.textContent = '最大公约数 (GCD): ' + g + '\n最小公倍数 (LCM): ' + l;
}

/* ========== 工具箱 UI：搜索 / 分类筛选 / 复制 / 回车执行 ========== */
(function initToolboxUI(){
  var grid = document.querySelector('.tools-grid');
  var search = document.getElementById('toolSearch');
  var chipsBox = document.getElementById('toolChips');
  var countEl = document.getElementById('toolCount');
  var emptyEl = document.getElementById('toolEmpty');
  if (!grid || !search || !countEl) return; // 页面没有工具箱时跳过

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.tool-card'));
  var currentFilter = 'all';
  var currentQuery = '';

  function refreshChipCounts(){
    if (!chipsBox) return;
    Array.prototype.forEach.call(chipsBox.querySelectorAll('.chip'), function(chip){
      var f = chip.getAttribute('data-filter');
      var n = f === 'all' ? cards.length
        : cards.filter(function(c){ return c.getAttribute('data-category') === f; }).length;
      var span = chip.querySelector('.chip-count');
      if (span) span.textContent = n;
    });
  }

  function applyFilter(){
    var visible = 0;
    cards.forEach(function(card){
      var cat = card.getAttribute('data-category');
      var matchCat = currentFilter === 'all' || cat === currentFilter;
      var matchQuery = !currentQuery || card.textContent.toLowerCase().indexOf(currentQuery) !== -1;
      var show = matchCat && matchQuery;
      card.style.display = show ? '' : 'none';
      if (show){
        visible++;
        card.classList.remove('tool-reveal');
        void card.offsetWidth; // 强制重排以重启动画
        card.classList.add('tool-reveal');
      }
    });
    countEl.textContent = visible + ' / ' + cards.length + ' 个工具';
    if (emptyEl) emptyEl.style.display = visible ? 'none' : '';
  }

  search.addEventListener('input', function(){
    currentQuery = this.value.trim().toLowerCase();
    applyFilter();
  });

  if (chipsBox){
    chipsBox.addEventListener('click', function(e){
      var chip = e.target.closest ? e.target.closest('.chip') : null;
      if (!chip) return;
      Array.prototype.forEach.call(chipsBox.querySelectorAll('.chip'), function(c){
        c.classList.remove('active');
      });
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      applyFilter();
    });
  }

  function flashCopyBtn(btn, msg){
    var old = btn.textContent;
    btn.textContent = msg;
    btn.classList.add('copied');
    setTimeout(function(){ btn.textContent = old; btn.classList.remove('copied'); }, 1200);
  }

  function copyText(text){
    if (navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve, reject){
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch(e){ reject(e); }
    });
  }

  // 给每张卡片加复制按钮
  cards.forEach(function(card){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-sm copy-btn';
    btn.textContent = '复制';
    btn.title = '复制本工具的全部结果';
    btn.setAttribute('aria-label', '复制本工具的全部结果');
    btn.addEventListener('click', function(){
      var parts = [];
      Array.prototype.forEach.call(card.querySelectorAll('.result'), function(r){
        if (r.textContent.trim()) parts.push(r.textContent.trim());
      });
      Array.prototype.forEach.call(card.querySelectorAll('textarea[readonly]'), function(t){
        if (t.value.trim()) parts.push(t.value.trim());
      });
      if (!parts.length){ flashCopyBtn(btn, '无结果'); return; }
      copyText(parts.join('\n\n')).then(
        function(){ flashCopyBtn(btn, '已复制 ✓'); },
        function(){ flashCopyBtn(btn, '失败'); }
      );
    });
    card.appendChild(btn);
  });

  // 输入框/下拉框里按回车，触发当前卡片的主操作
  grid.addEventListener('keydown', function(e){
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'SELECT')) return;
    if (t.type === 'checkbox' || t.type === 'color' || t.type === 'button' || t.type === 'submit') return;
    e.preventDefault();
    var card = t.closest ? t.closest('.tool-card') : null;
    var btn = card && card.querySelector('.btn-sm.accent');
    if (btn) btn.click();
  });

  refreshChipCounts();
  applyFilter();
})();
