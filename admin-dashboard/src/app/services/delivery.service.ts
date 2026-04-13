import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  Delivery, 
  DeliveryStats, 
  DeliveryStatus, 
  Driver, 
  Restaurant, 
  Customer, 
  CreateDeliveryRequest,
  OrderItem 
} from '../models/delivery.model';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly base = 'http://localhost:8081/api/deliveries';
  private readonly driversBase = 'http://localhost:8081/api/drivers';

  constructor(private http: HttpClient) {}

  // Delivery CRUD operations
  getAll(): Observable<Delivery[]> { 
    // Temporarily use mock data until backend is restarted with new security config
    return this.getMockDeliveries();
    // return this.http.get<Delivery[]>(this.base); 
  }

  getById(id: number): Observable<Delivery> {
    // Mock implementation
    return this.getMockDeliveries().pipe(
      map(deliveries => deliveries.find(d => d.id === id)!),
      map(delivery => delivery || {} as Delivery)
    );
    // return this.http.get<Delivery>(`${this.base}/${id}`);
  }

  create(delivery: CreateDeliveryRequest): Observable<Delivery> {
    // Mock implementation - simulate successful creation
    const newDelivery: Delivery = {
      id: Math.floor(Math.random() * 1000) + 100,
      orderId: `ORD-${String(Date.now()).slice(-6)}`,
      customerId: delivery.customerId,
      restaurantId: delivery.restaurantId,
      deliveryAddress: delivery.deliveryAddress,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    // Simulate API delay
    return of(newDelivery).pipe(delay(500));
    // return this.http.post<Delivery>(this.base, delivery);
  }

  update(id: number, delivery: Partial<Delivery>): Observable<Delivery> {
    // Mock implementation - simulate successful update
    return this.getMockDeliveries().pipe(
      map(deliveries => deliveries.find(d => d.id === id)),
      map(existingDelivery => ({ ...existingDelivery, ...delivery } as Delivery)),
      delay(500)
    );
    // return this.http.put<Delivery>(`${this.base}/${id}`, delivery);
  }

  delete(id: number): Observable<void> { 
    // Mock implementation - simulate successful deletion
    return of(void 0).pipe(delay(500));
    // return this.http.delete<void>(`${this.base}/${id}`); 
  }

  // Status management
  updateStatus(id: number, status: DeliveryStatus): Observable<Delivery> {
    // Mock implementation - simulate successful status update
    return this.getMockDeliveries().pipe(
      map(deliveries => deliveries.find(d => d.id === id)),
      map(delivery => ({ ...delivery, status } as Delivery)),
      delay(500)
    );
    // return this.http.put<Delivery>(`${this.base}/${id}/status?status=${status}`, {});
  }

  assignDriver(deliveryId: number, driverId: string): Observable<Delivery> {
    // Mock implementation - simulate successful driver assignment
    return this.getMockDeliveries().pipe(
      map(deliveries => deliveries.find(d => d.id === deliveryId)),
      map(delivery => ({ ...delivery, driverId } as Delivery)),
      delay(500)
    );
    // return this.http.put<Delivery>(`${this.base}/${deliveryId}/assign-driver`, { driverId });
  }

  // Statistics
  getStats(): Observable<DeliveryStats> { 
    // Use mock data for now due to CORS issues
    return this.getMockStats();
    // return this.http.get<DeliveryStats>(`${this.base}/stats`); 
  }

  // Driver management
  getAllDrivers(): Observable<Driver[]> { 
    // Use mock data for now due to CORS issues
    return this.getMockDrivers();
    // return this.http.get<Driver[]>(this.driversBase); 
  }

  getAvailableDrivers(): Observable<Driver[]> {
    // Use mock data for now due to CORS issues
    return this.getMockDrivers().pipe(
      map(drivers => drivers.filter(d => d.available))
    );
    // return this.http.get<Driver[]>(`${this.driversBase}/available`);
  }

  createDriver(driver: Partial<Driver>): Observable<Driver> { 
    // Mock implementation - simulate successful creation
    const newDriver: Driver = {
      id: Math.floor(Math.random() * 1000) + 100,
      name: driver.name || '',
      phone: driver.phone || '',
      email: driver.email,
      avatar: driver.avatar,
      vehicle: driver.vehicle,
      vehicleType: driver.vehicleType || 'CAR',
      licensePlate: driver.licensePlate,
      rating: driver.rating || 5.0,
      totalDeliveries: 0,
      available: driver.available || true
    };
    
    // Simulate API delay
    return of(newDriver).pipe(delay(500));
    // return this.http.post<Driver>(this.driversBase, driver); 
  }

  updateDriver(id: number, driver: Partial<Driver>): Observable<Driver> { 
    // Mock implementation - simulate successful update
    return this.getMockDrivers().pipe(
      map(drivers => drivers.find(d => d.id === id)),
      map(existingDriver => ({ ...existingDriver, ...driver } as Driver)),
      delay(500)
    );
    // return this.http.put<Driver>(`${this.driversBase}/${id}`, driver); 
  }

  deleteDriver(id: number): Observable<void> { 
    // Mock implementation - simulate successful deletion
    return of(void 0).pipe(delay(500));
    // return this.http.delete<void>(`${this.driversBase}/${id}`); 
  }

  // Restaurants (for delivery creation)
  getRestaurants(): Observable<Restaurant[]> {
    // Use mock data for now due to CORS issues
    return this.getMockRestaurants();
    // return this.http.get<Restaurant[]>('http://localhost:8083/api/restaurants');
  }

  // Customers (for delivery creation)
  getCustomers(): Observable<Customer[]> {
    // Use mock data for now due to CORS issues
    return this.getMockCustomers();
    // return this.http.get<Customer[]>('http://localhost:8085/api/users/customers');
  }

  searchCustomers(query: string): Observable<Customer[]> {
    // Use mock data for now due to CORS issues
    return this.getMockCustomers().pipe(
      map(customers => customers.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        c.email?.toLowerCase().includes(query.toLowerCase())
      ))
    );
    // return this.http.get<Customer[]>(`http://localhost:8085/api/users/customers/search?q=${query}`);
  }

  // Mock data methods (for development)
  getMockDeliveries(): Observable<Delivery[]> {
    const mockDeliveries: Delivery[] = [
      {
        id: 1,
        orderId: 'ORD-001',
        customerId: '1',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        restaurantId: '1',
        restaurantName: 'Pizza Palace',
        restaurantAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave, Apt 2B',
        deliveryInstructions: 'Ring doorbell twice',
        status: 'ON_THE_WAY',
        driverId: '1',
        driverName: 'Mike Johnson',
        driverPhone: '+1987654321',
        driverVehicle: 'Honda Civic',
        driverRating: 4.8,
        estimatedMinutes: 25,
        deliveryFee: 3.99,
        distance: 2.5,
        orderValue: 24.99,
        items: [
          { id: 1, name: 'Margherita Pizza', quantity: 1, price: 18.99 },
          { id: 2, name: 'Garlic Bread', quantity: 1, price: 6.00 }
        ],
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        confirmedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        pickedUpAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        orderId: 'ORD-002',
        customerId: '2',
        customerName: 'Sarah Smith',
        customerPhone: '+1122334455',
        restaurantId: '2',
        restaurantName: 'Burger House',
        restaurantAddress: '789 Food St',
        deliveryAddress: '321 Pine St, Unit 5',
        status: 'PENDING',
        estimatedMinutes: 35,
        deliveryFee: 2.99,
        distance: 1.8,
        orderValue: 16.50,
        items: [
          { id: 3, name: 'Classic Burger', quantity: 2, price: 12.99 },
          { id: 4, name: 'Fries', quantity: 1, price: 3.51 }
        ],
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        orderId: 'ORD-003',
        customerId: '3',
        customerName: 'Michael Brown',
        customerPhone: '+1999888777',
        restaurantId: '3',
        restaurantName: 'Sushi Express',
        restaurantAddress: '456 Ocean Ave',
        deliveryAddress: '654 Elm St',
        deliveryInstructions: 'Leave at door',
        status: 'DELIVERED',
        driverId: '2',
        driverName: 'Lisa Chen',
        driverPhone: '+1555666777',
        driverVehicle: 'Yamaha Scooter',
        driverRating: 4.9,
        estimatedMinutes: 40,
        actualMinutes: 38,
        deliveryFee: 4.99,
        distance: 3.2,
        orderValue: 32.50,
        items: [
          { id: 5, name: 'Salmon Roll', quantity: 2, price: 12.00 },
          { id: 6, name: 'Tuna Sashimi', quantity: 1, price: 15.00 },
          { id: 7, name: 'Miso Soup', quantity: 1, price: 5.50 }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        confirmedAt: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
        pickedUpAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
        deliveredAt: new Date(Date.now() - 42 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        orderId: 'ORD-004',
        customerId: '1',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        restaurantId: '4',
        restaurantName: 'Taco Fiesta',
        restaurantAddress: '321 Spice Rd',
        deliveryAddress: '456 Oak Ave, Apt 2B',
        status: 'PREPARING',
        estimatedMinutes: 25,
        deliveryFee: 3.49,
        distance: 2.1,
        orderValue: 19.75,
        items: [
          { id: 8, name: 'Chicken Tacos', quantity: 3, price: 8.99 },
          { id: 9, name: 'Guacamole', quantity: 1, price: 4.99 },
          { id: 10, name: 'Churros', quantity: 1, price: 5.77 }
        ],
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        confirmedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        orderId: 'ORD-005',
        customerId: '4',
        customerName: 'Emma Wilson',
        customerPhone: '+1777666555',
        restaurantId: '1',
        restaurantName: 'Pizza Palace',
        restaurantAddress: '123 Main St',
        deliveryAddress: '987 Maple Dr, Apt 12',
        deliveryInstructions: 'Call when arrived',
        status: 'CONFIRMED',
        estimatedMinutes: 30,
        deliveryFee: 3.99,
        distance: 2.8,
        orderValue: 28.50,
        items: [
          { id: 11, name: 'Pepperoni Pizza', quantity: 1, price: 20.99 },
          { id: 12, name: 'Caesar Salad', quantity: 1, price: 7.51 }
        ],
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        confirmedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 6,
        orderId: 'ORD-006',
        customerId: '5',
        customerName: 'David Garcia',
        customerPhone: '+1444333222',
        restaurantId: '2',
        restaurantName: 'Burger House',
        restaurantAddress: '789 Food St',
        deliveryAddress: '159 Cedar Ave',
        status: 'PICKED_UP',
        driverId: '3',
        driverName: 'Carlos Rodriguez',
        driverPhone: '+1888999000',
        driverVehicle: 'Mountain Bike',
        driverRating: 4.7,
        estimatedMinutes: 20,
        deliveryFee: 2.99,
        distance: 1.5,
        orderValue: 22.25,
        items: [
          { id: 13, name: 'Double Cheeseburger', quantity: 1, price: 14.99 },
          { id: 14, name: 'Onion Rings', quantity: 1, price: 4.99 },
          { id: 15, name: 'Milkshake', quantity: 1, price: 2.27 }
        ],
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        confirmedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        pickedUpAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: 7,
        orderId: 'ORD-007',
        customerId: '2',
        customerName: 'Sarah Smith',
        customerPhone: '+1122334455',
        restaurantId: '3',
        restaurantName: 'Sushi Express',
        restaurantAddress: '456 Ocean Ave',
        deliveryAddress: '321 Pine St, Unit 5',
        status: 'CANCELLED',
        estimatedMinutes: 35,
        deliveryFee: 4.99,
        distance: 2.9,
        orderValue: 45.00,
        cancellationReason: 'Customer requested cancellation',
        items: [
          { id: 16, name: 'Dragon Roll', quantity: 1, price: 18.00 },
          { id: 17, name: 'California Roll', quantity: 2, price: 12.00 },
          { id: 18, name: 'Edamame', quantity: 1, price: 3.00 }
        ],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        cancelledAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 8,
        orderId: 'ORD-008',
        customerId: '6',
        customerName: 'Lisa Anderson',
        customerPhone: '+1666777888',
        restaurantId: '1',
        restaurantName: 'Pizza Palace',
        restaurantAddress: '123 Main St',
        deliveryAddress: '753 Birch Lane',
        deliveryInstructions: 'Ring doorbell, dog friendly',
        status: 'DELIVERED',
        driverId: '1',
        driverName: 'Mike Johnson',
        driverPhone: '+1987654321',
        driverVehicle: 'Honda Civic',
        driverRating: 4.8,
        estimatedMinutes: 35,
        actualMinutes: 32,
        deliveryFee: 3.99,
        distance: 3.5,
        orderValue: 31.25,
        items: [
          { id: 19, name: 'Vegetarian Pizza', quantity: 1, price: 19.99 },
          { id: 20, name: 'Garlic Knots', quantity: 1, price: 6.99 },
          { id: 21, name: 'Tiramisu', quantity: 1, price: 4.27 }
        ],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        confirmedAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
        pickedUpAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        deliveredAt: new Date(Date.now() - 3.2 * 60 * 60 * 1000).toISOString()
      }
    ];
    return of(mockDeliveries);
  }

  getMockDrivers(): Observable<Driver[]> {
    const mockDrivers: Driver[] = [
      {
        id: 1,
        name: 'Mike Johnson',
        phone: '+1987654321',
        email: 'mike@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        vehicle: 'Honda Civic',
        vehicleType: 'CAR',
        licensePlate: 'ABC-123',
        rating: 4.8,
        totalDeliveries: 245,
        available: true,
        currentLocation: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: '123 Current St'
        }
      },
      {
        id: 2,
        name: 'Lisa Chen',
        phone: '+1555666777',
        email: 'lisa@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        vehicle: 'Yamaha Scooter',
        vehicleType: 'SCOOTER',
        licensePlate: 'XYZ-789',
        rating: 4.9,
        totalDeliveries: 189,
        available: false
      },
      {
        id: 3,
        name: 'Carlos Rodriguez',
        phone: '+1888999000',
        email: 'carlos@example.com',
        vehicle: 'Mountain Bike',
        vehicleType: 'BIKE',
        rating: 4.7,
        totalDeliveries: 156,
        available: true
      }
    ];
    return of(mockDrivers);
  }

  getMockRestaurants(): Observable<Restaurant[]> {
    const mockRestaurants: Restaurant[] = [
      {
        id: 1,
        name: 'Pizza Palace',
        address: '123 Main St, Downtown',
        phone: '+1234567890',
        email: 'info@pizzapalace.com',
        cuisine: 'Italian',
        rating: 4.5,
        active: true
      },
      {
        id: 2,
        name: 'Burger House',
        address: '789 Food St, Midtown',
        phone: '+1987654321',
        email: 'orders@burgerhouse.com',
        cuisine: 'American',
        rating: 4.3,
        active: true
      },
      {
        id: 3,
        name: 'Sushi Express',
        address: '456 Ocean Ave, Uptown',
        phone: '+1555123456',
        email: 'hello@sushiexpress.com',
        cuisine: 'Japanese',
        rating: 4.7,
        active: true
      },
      {
        id: 4,
        name: 'Taco Fiesta',
        address: '321 Spice Rd, Southside',
        phone: '+1777888999',
        email: 'orders@tacofiesta.com',
        cuisine: 'Mexican',
        rating: 4.4,
        active: false
      }
    ];
    return of(mockRestaurants);
  }

  getMockCustomers(): Observable<Customer[]> {
    const mockCustomers: Customer[] = [
      {
        id: 1,
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        addresses: [
          {
            id: 1,
            label: 'Home',
            address: '456 Oak Ave, Apt 2B, Springfield',
            instructions: 'Ring doorbell twice',
            isDefault: true
          },
          {
            id: 2,
            label: 'Work',
            address: '789 Business Blvd, Suite 100, Springfield',
            instructions: 'Call when arrived',
            isDefault: false
          }
        ]
      },
      {
        id: 2,
        name: 'Sarah Smith',
        phone: '+1122334455',
        email: 'sarah@example.com',
        addresses: [
          {
            id: 3,
            label: 'Home',
            address: '321 Pine St, Unit 5, Springfield',
            isDefault: true
          }
        ]
      },
      {
        id: 3,
        name: 'Michael Brown',
        phone: '+1999888777',
        email: 'michael@example.com',
        addresses: [
          {
            id: 4,
            label: 'Home',
            address: '654 Elm St, Springfield',
            instructions: 'Leave at door',
            isDefault: true
          }
        ]
      }
    ];
    return of(mockCustomers);
  }

  getMockStats(): Observable<DeliveryStats> {
    const mockStats: DeliveryStats = {
      totalDeliveries: 1247,
      pendingDeliveries: 8,
      activeDeliveries: 15,
      completedDeliveries: 1198,
      cancelledDeliveries: 26,
      totalDrivers: 12,
      availableDrivers: 8,
      averageDeliveryTime: 28,
      totalRevenue: 15678.50
    };
    return of(mockStats);
  }
}
