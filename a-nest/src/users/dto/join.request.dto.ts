export class JoinRequestDto {
  // interface < class
  // typescript 에만 존재하지않고, 실제 js로 남아있게끔
  // export default < export class
  public email: string;
  public nickname: string;
  public password: string;
}
