import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
        errorFormat: "pretty",
    });
} else {
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient({
            errorFormat: "pretty",
        });
    }
    prisma = globalWithPrisma.prisma;
}

export default prisma;

// file to test different methods before using in production 


// clear prisma database
// async function fresh(){
// 	await prisma.$connect();

// 	const delUser = await prisma.user.deleteMany({
// 		where: {}
// 	});
// 	// const delResume = await prisma.resumeData.deleteMany();
// 	console.log(delUser);
// }

// fresh()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (e) => {
// 		console.error(e);
// 		await prisma.$disconnect();
// 		process.exit(1);
// 	});

// async function main() {
// 	// Connect the client
// 	await prisma.$connect();
// 	const newUser = await prisma.user.create(
// 		{
// 			data: {
// 				clerkId: 'testing id',
// 				firstName: "John",
// 				lastName: 'last',
// 				email: "test@prisma.com",
// 				photo: 'https://someimageLink.io',
// 				username: 'first+last'
// 			},
// 		}
// 	)

// 	console.log(newUser);
// 	// // create new Event
// }


// main()
// get user with the resumes included in response
// const users = await prisma.user.findMany({
// 	include:{
// 		resumes: true
// 	}
// })
// console.log(users[0].resumes);


// console.log(test);
// const test1 = await prisma.user.create({
// 	data: {
// 		name: "admin",
// 		email: "admin@admin.com",
// 		password: "admin",
// 		UrlTable: {
// 			create: {
// 				url: "https://www.google.com",
// 				slug: "gogle",
// 			},
// 		},
// 	},
// });
// console.log(test1);
// }

// main()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (e) => {
// 		console.error(e);
// 		await prisma.$disconnect();
// 		process.exit(1);
// 	});

// export default prisma;

// execution
// npx tsc prisma/seed.ts
// node prisma/seed.js