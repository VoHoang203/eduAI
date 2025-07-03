import {prisma} from "@/db/prisma"

/*
	This script is used to create categories in the Category table programmatically
	To run this script, run: "node scripts/seed.ts" in the terminal
*/
async function main() {
    try {
        await prisma.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Engineering" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Photography" },
                { name: "Accounting" },
                { name: "Filming" },
            ],
        });

        console.log("Success");
    } catch (error) {
        console.log("Error seeding the prisma categories", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
