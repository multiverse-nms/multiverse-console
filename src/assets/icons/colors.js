export function getStatusColor (status) {
  if (status === 'UP') {
    return 'rgba(14, 150, 71, 1)'
  } else if (status === 'DOWN') {
    return 'rgba(255, 83, 73, 1)'
  } else {
    return 'rgba(255, 194, 0, 1)'
  }
}

export function getStatusClass (status) {
  if (status === 'UP') {
    return 'row-up'
  } else if (status === 'DOWN') {
    return 'row-down'
  }
  return 'row-disconn'
}

export function getAvailableClass (status) {
  if (status === true) {
    return 'row-up'
  }
  return 'row-down'
}

export function getBusyColor (busy) {
  if (busy === true) {
    return 'info'
  }
  return 'gray'
}
