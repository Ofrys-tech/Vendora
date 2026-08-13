export type FulfillmentStatus = 'pending' | 'processing' | 'fulfilled' | 'manual_review' | 'failed';
export type DeliveryItem = Readonly<{
    id: string;
    instructions?: string;
    secret?: string;
    title: string;
}>;
//# sourceMappingURL=index.d.ts.map