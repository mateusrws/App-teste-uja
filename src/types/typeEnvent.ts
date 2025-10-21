type Event = {
    title: string;
    description?: string;
    date: Date;
    hour: string;
    points: number;
    image?: string;
    maximumParticipants?: number;
    address: string;
    city: string;
    state?: string;
    preco?: number;
}

export default Event;


// model Event {
//     id                  String     @id @default(uuid())
//     title               String
//     description         String?
//     slug                String     @unique
//     maximumParticipants Int?       @map("maximum_participants")
//     date                DateTime
//     hour                String
//     points              Int
//     image               String?
//     address             String
//     city                String
//     preco               Float?
//     state               String?
//     organizerId         String?
//     user                User?      @relation("UserEvents", fields: [organizerId], references: [id])
//     ingressos           Ingresso[] @relation("IngressosEvents")

//     createdAt DateTime @default(now())
//     isActive  Boolean  @default(true)

//     @@map("events")
// }