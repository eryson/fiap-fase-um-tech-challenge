export type ServiceOrderModel = {
  id: number
  protocol: string
  clientId: number
  vehicleId: number
  status: ServiceOrderStatus
  budgetTotal: number
  createdAt: Date
  updatedAt: Date
}

export type ServiceOrderStatus =
  | 'received'
  | 'diagnosing'
  | 'awaiting_approval'
  | 'in_progress'
  | 'finished'
  | 'delivered'
