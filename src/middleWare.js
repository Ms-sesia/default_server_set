export const isAuthenticated = (request) => {
  console.log("isAuthenticated 일단 전달");
  if (!request.user) throw new Error("먼저 로그인이 필요합니다.");
  return;
};
