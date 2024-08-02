import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const lanesMapping = {
	M25: 5,
	M50: 8,
	M25_2: 6,
	M25_N: 4,
	M25_C: 2,
};

async function main() {
	try {
		for (const poolName of Object.keys(lanesMapping)) {
			const existingPool = await prisma.pool.findFirst({
				where: {
					name: poolName,
				},
			});
			if (existingPool) continue;
			const lanesQuantity = lanesMapping[poolName];
			const pool = await prisma.pool.create({
				data: {
					name: poolName,
				},
			});
			for (let i = 0; i < lanesQuantity; i++) {
				const existingLane = await prisma.lane.findFirst({
					where: {
						poolId: pool.id,
						index: i,
					},
				});
				if (existingLane) continue;
				await prisma.lane.create({
					data: {
						poolId: pool.id,
						index: i,
					},
				});
			}
		}
	} catch (e) {
		console.error(e);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
