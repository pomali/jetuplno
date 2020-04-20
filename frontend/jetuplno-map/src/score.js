export function getScore() {
  const cookieScore = document.cookie.replace(
    /(?:(?:^|.*;\s*)jetuplno-score\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  const score = parseInt(cookieScore);
  return !isNaN(score) ? score : 0;
}
export function addScore() {
  const score = getScore();
  document.cookie = `jetuplno-score=${
    score + 1
  };  expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}
