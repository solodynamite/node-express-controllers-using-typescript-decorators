import { Request } from 'express'

export default ({ request }: any) => {

    const { password, repeatPassword} = request.body

    if (!password || !repeatPassword) {

        return; // exempt - other rules will validate this
    }

    let violations;

    if (password !== repeatPassword) {

        violations = {

            password: {
                message: 'Does not match',
                fullMessage: 'New password does not match repeating password'
            },

            repeatPassword: {
                message: 'Does not match',
                fullMessage: 'Repeat password does not match new password'
            }
        };
    }

    return violations;
}