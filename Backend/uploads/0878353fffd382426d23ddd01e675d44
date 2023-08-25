function isPangram(string){
  string = string.toLowerCase()
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  
  for (let i = 0; i < alphabet.length; i++) {
    if (string.includes(alphabet[i])) {
      alphabet[i]= alphabet[i].replace(alphabet[i], '')
    }
  }
  alphabet = alphabet.join('')
  if (alphabet.length === 0) {
    return true
  }else {
    return false
  }
}