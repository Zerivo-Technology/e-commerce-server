const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();

async function main() {
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

    const products = [
        {
            id: "acda7a57-cac4-425d-ba4b-6538c5b0bb35",
            nameProduct: "Tas Channel",
            about: "Simple dan elegan, nyaman digunakan, serta memberikan kesan mewah dan praktis dalam berbagai kesempatan.",
            category: parseInt(3),
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731645337209_tas-wanita-1.jpg",
            stoks: "20",
            price: "200000",
        },
        {
            id: "4af2357a-fda8-4178-86b2-e12891238b88",
            nameProduct: "Tas LV",
            about: "Simple dan elegan, nyaman digunakan, memberikan kepercayaan diri, serta menonjolkan kesan modern dan stylish",
            category: parseInt(3),
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731645112480_tas-wanita.jpg",
            stoks: "20",
            price: "700000",
        },
        {
            id: "b8e15710-8700-450e-8c53-64ca7dcdecf0",
            nameProduct: "Sepatu  Crocodile",
            about: "Kulit asli dan nyaman digunakan, tahan lama, mudah dirawat, serta memberikan kesan eksklusif dan premium.",
            category: parseInt(4),
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731646623575_sepatu-pria.jpg",
            stoks: "20",
            price: "1000000",
        },
        {
            id: "6af669b3-f13f-4a5b-860b-41bb3b5b0411",
            nameProduct: "Kaos Uniqlo",
            about: "Baju kaus yang nyaman dan sejuk, lembut di kulit, cocok untuk berbagai cuaca, dan memberikan rasa santai sepanjang hari.",
            category: parseInt(5),
            image:
                "https://zxbxtnkyleblalhoknyk.supabase.co/storage/v1/object/public/imagesProducts/images/1731653043417_baju-kaos-pria.jpg",
            stoks: "20",
            price: "300000",
        },
    ];

    const categories = [
        {
            id: 1,
            nameCategory: "Men"
        },
        {
            id: 2,
            nameCategory: "Women"
        },
        {
            id: 3,
            nameCategory: "Bag"
        },
        {
            id: 4,
            nameCategory: "Shoes"
        },
        {
            id: 5,
            nameCategory: "Clothes"
        },
    ]

    const sizes = [
        {
            id: 1,
            size: "S"
        },
        {
            id: 2,
            size: "M"
        },
        {
            id: 3,
            size: "L"
        },
        {
            id: 4,
            size: "XL"
        }

    ]

    // // Data Size //
    for (const size of sizes) {
        await Prisma.size.create({
            data: {
                id: size.id,
                size: size.size
            }
        })
    }


    for (const category of categories) {
        await Prisma.category.create({
            data: {
                id: category.id,
                nameCategory: category.nameCategory
            }
        })
    }


    for (const user of users) {
        await Prisma.user.create({ data: user });
    }


    for (const product of products) {
        await Prisma.product.create({
            data: {
                id: product.id,
                nameProduct: product.nameProduct,
                about: product.about,
                image: product.image,
                stoks: parseInt(product.stoks),
                price: parseFloat(product.price),
                category: {
                    connect: { id: product.category },
                },
            },
        });
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
