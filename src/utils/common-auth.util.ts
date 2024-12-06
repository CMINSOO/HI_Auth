export function doubleCheckPW(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    //TODO: Error핸들링
    throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
  }
}
