import { Router } from 'express';
import { Pet, User } from '../database'

const router = Router();

router.get('/', async (req, res) => {
    const sortedUsers = await User.query().select().modify('orderByEmail');

    res.send(sortedUsers);
})

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    const createdUser = await User.query().insert({
        name,
        email,
        password
    });

    res.send(createdUser);
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;

    const updatedUser = await User.query().patchAndFetchById(id, { ...req.body });

    res.send(updatedUser);
});

router.patch('/:id/pets', async (req, res) => {
    const { id } = req.params;
    const { petsId } = req.body;

    const pets = await User.transaction(async trx => {
        const user = await User.query(trx).findById(id);

        if (!user) {
            throw new Error(`User with id ${id} does not exist !`);
        }

        const pets = await Pet.query(trx).findByIds(petsId);

        if (!pets || !pets.length) {
            throw new Error(`Pets do not exist`);
        }

        await user.$relatedQuery('pets').relate(pets);

        return user.$relatedQuery('pets');
    })

    res.send(pets);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await User.query().deleteById(id);

    res.send({ message: 'User was deleted' });
})

export default router;
