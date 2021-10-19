import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    response.status(401).json({ errorCode: "token.invalid" });
  }

  /**
   * authToken will be something like:
   * Bearer a4e88444rt128f1844g1h51ae8g41v68fz4gE6r8g468rh8
   * So we'll get only position 2 from the splitted string.
   *  */
  const [, token] = authToken.split(" ");

  try {
    // Check if token is valid:
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

    request.user_id = sub;

    return next();
  } catch (err) {
    return response.status(401).json({ errorCode: "token.expired" });
  }
}
