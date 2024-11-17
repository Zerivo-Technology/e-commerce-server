const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();

async function main() {
    // Data Users
    const users = [
        {
            id: "6dcd07fa-f12a-4ef7-92be-256feb3d0f4a",
            name: "admin",
            email: "admin@gmail.com",
            password: "$2a$10$kcVWcGjq6MO.BJ1WFW0OSe3fz7AjxRbyTz65nqV93nCsepLH95KFS",
            phoneNumber: "000000000",
            role: "admin",
            provider: "local",
            providerId: null,
        },
        {
            id: "e1fccbd8-50ac-4461-ada9-bbbba5632a3c",
            name: "Alif farid rahman",
            email: "alif.faridrhmn60@gmail.com",
            password: "$2a$10$.jbI/it1UZ5daOeCq.wd5.otnHfzzVtUxDjJDVtEdizB81cTxWbr2",
            phoneNumber: "000000000",
            role: "user",
            provider: "local",
            providerId: null,
        },
        {
            id: "ad8927b6-520f-4971-aed6-238eb9de7a1f",
            name: "Ratih",
            email: "Ratihmulia.com",
            password: "$2a$10$H/6UeDTwwgbz2e.54F0Vee6sROUoLXUq55qg15m2F1fJj0mU9xUla",
            phoneNumber: "000000000",
            role: "user",
            provider: "local",
            providerId: null,
        },
    ];

    // Data Products
    const products = [
        {
            id: "acda7a57-cac4-425d-ba4b-6538c5b0bb35",
            nameProduct: "Tas Channel",
            about: "Simple dan elegan, nyaman digunakan, serta memberikan kesan mewah dan praktis dalam berbagai kesempatan.",
            category: "BAG",
            age: "WOMEN",
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731645337209_tas-wanita-1.jpg",
            quantity: "20",
            price: "200000",
        },
        {
            id: "4af2357a-fda8-4178-86b2-e12891238b88",
            nameProduct: "Tas LV",
            about: "Simple dan elegan, nyaman digunakan, memberikan kepercayaan diri, serta menonjolkan kesan modern dan stylish",
            category: "BAG",
            age: "WOMEN",
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731645112480_tas-wanita.jpg",
            quantity: "20",
            price: "700000",
        },
        {
            id: "b8e15710-8700-450e-8c53-64ca7dcdecf0",
            nameProduct: "Sepatu  Crocodile",
            about: "Kulit asli dan nyaman digunakan, tahan lama, mudah dirawat, serta memberikan kesan eksklusif dan premium.",
            category: "SHOES",
            age: "MEN",
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731646623575_sepatu-pria.jpg",
            quantity: "20",
            price: "1000000",
        },
        {
            id: "6af669b3-f13f-4a5b-860b-41bb3b5b0411",
            nameProduct: "Kaos Uniqlo",
            about: "Baju kaus yang nyaman dan sejuk, lembut di kulit, cocok untuk berbagai cuaca, dan memberikan rasa santai sepanjang hari.",
            category: "CLOTHES",
            age: "MEN",
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731653043417_baju-kaos-pria.jpg",
            quantity: "20",
            price: "300000",
        },
    ];

    // Insert Users
    for (const user of users) {
        await Prisma.user.create({ data: user });
    }

    // Insert Products
    for (const product of products) {
        await Prisma.products.create({ data: product });
    }

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await Prisma.$disconnect();
    });
