import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwt_config } from "src/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // we want to check expiration date
            secretOrKey: jwt_config.secret,
        });
    }

    async validate(payload: any) {
        return {
            email: payload.email,
            expired: payload.exp,
        }
    }
}