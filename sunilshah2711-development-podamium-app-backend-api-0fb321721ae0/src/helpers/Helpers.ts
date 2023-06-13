export class Helpers {
  public static async formatResponse(status: number, isSuccess: boolean, message: string, payload?: object) {
    return {
      status,
      data: {
        isSuccess,
        message,
        payload
      }
    }
  }

  public static alphaHash() {
    return Math.random().toString(36).substring(2, 11)
  }
}