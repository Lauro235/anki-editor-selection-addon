function AND(i1,i2) {
  if (i1 && i2) {
    return true;
  }
  return false
}

function OR(i1,i2) {
  if(i1 || i2) {
    return true
  }
  return false
}

function NOT(i) {
  return !i;
}

export {NOT}