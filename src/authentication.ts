import { Request, Response } from "express";
import { EXPIRED_AUTH_TOKEN, INVALID_AUTH_TOKEN, MISSING_AUTH_TOKEN, UNAUTHORIZED } from "./config";

const APPLICATION_ID: string = process.env.APPLICATION_ID || "";

const TENANT_ID: string = process.env.TENANT_ID || "";

const DOMAINS: string = process.env.DOMAINS || "";

export function authenticate(request: Request, response: Response): boolean {
	const authToken: string | undefined = request.get('AuthorizationToken');

	if (authToken == undefined
		|| authToken == null
		|| authToken.length == 0) {

		return (response.status(400)
			.send(MISSING_AUTH_TOKEN), false);
	}

	try {
		const decoded = JSON.parse(
			Buffer.from(authToken.split(".")[1], "base64").toString()
		);
		if (decoded['appid'] !== APPLICATION_ID
			|| decoded['tid'] !== TENANT_ID
			|| !DOMAINS.includes(decoded['unique_name'].split('@')[1])) {

			console.log(APPLICATION_ID + " " + TENANT_ID + " " + DOMAINS);
			return (response.status(400)
				.send(UNAUTHORIZED), false);
		}

		if (parseInt(decoded['exp']) <= Math.round(Date.now() / 1e3))
			return (response.status(400)
				.send(EXPIRED_AUTH_TOKEN), false);
		return (true);
	}
	catch (exception: any) {
		return (response.status(400)
			.send(INVALID_AUTH_TOKEN), false);
	}

}
