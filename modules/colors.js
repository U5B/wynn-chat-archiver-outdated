const colored = {}
// COMMENT: Minecraft Colors to ANSI list
const colors = { 0: '\u001b[0;30m', 1: '\u001b[0;34m', 2: '\u001b[0;32m', 3: '\u001b[0;36m', 4: '\u001b[0;31m', 5: '\u001b[0;35m', 6: '\u001b[0;33m', 7: '\u001b[0;37m', 8: '\u001b[1;30m', 9: '\u001b[1;34m', a: '\u001b[1;32m', b: '\u001b[1;36m', c: '\u001b[1;31m', d: '\u001b[1;35m', e: '\u001b[1;33m', f: '\u001b[1;37m', l: '\u001b[1m', r: '\u001b[0m', m: '\u001b[4m', n: '\u001b[4m', o: '\u001b[3m', k: '\u001b[5m' }
// COMMENT: convert Minecraft colors to ANSI
colored.mccolor = function (str) {
  return str.replace(/§([0-9a-z])/g, function (m, contents) {
    return colors[contents] || '\u001b[0m'
  })
}
// COMMENT: This is used to add color to messages - unused due to chalk
colored.c = function (c, msg) { return '§r' + '§' + c + msg + '§r' }
// COMMENT: This is used to add resets to the beginning and ends of messages
colored.r = function (msg) { return '§r' + msg + '§r' }
// COMMENT: strip all ansi or color codes
// function stripansi (str) { return str.replace(/\[\d+\w/g, '') }
colored.stripthes = function (str) { return str.replace(/§(?:[0-9a-z])/g, '') }
module.exports = colored
