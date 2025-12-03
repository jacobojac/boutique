import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchQuery = query.trim();

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { actif: true },
          {
            OR: [
              {
                nom: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                collections: {
                  some: {
                    collection: {
                      nom: {
                        contains: searchQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        collections: {
          include: {
            collection: true,
          },
        },
        variants: true,
      },
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors de la recherche de produits:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    );
  }
}
