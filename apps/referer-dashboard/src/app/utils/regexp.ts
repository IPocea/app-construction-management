export function emailRegExp(): RegExp {
  return /[a-z0-9\-\_\.0]+@[a-z0-9\-\_\.]+\.[a-z]{2,}/i;
}

export function passwordRegExp(): RegExp {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&\^\(\)])[A-Za-z\d@#$!%*?&\^\(\)]{8,}$/;
}

export function numberRegExp(): RegExp {
  return /^\d{4,12}$/;
}

export function onlyNumbers(): RegExp {
  return /^[0-9.]+$/;
}
export function onlyLetters(): RegExp {
  return /^[A-Za-z]+$/;
}
