
export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatEther = (balance: any) => {
  return balance/(10**18);
}
