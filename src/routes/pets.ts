import { Router } from 'express';
import { Pet, User } from '../database'

const router = Router();

router.get('/', async (req, res) => {
    const pets = await Pet.query().withGraphFetched('owner');

    res.send(pets);
});

router.post('/', async (req, res) => {
    const { name, type, ownerId } = req.body;

    const { pet, user } = await Pet.transaction(async trx => {
        const user = await User.query(trx).findById(ownerId);

        if (!user) {
            throw new Error(`User with id ${ownerId} does not exist`);
        }

        const pet = await Pet.query(trx).insertAndFetch({ name, type })

        return { pet: await pet.$fetchGraph('owner'), user}
    });

    await pet.$relatedQuery('owner').relate(user);

    res.send(pet);
});

export default router;
