export function isApproximatively(a: number,b: number):boolean {
  return a > b - 0.1 && a < b + 0.1;
}