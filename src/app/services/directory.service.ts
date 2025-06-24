import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private apiUrl: string = 'https://api.mycheckpoint.cl/api/v1';
  private token: string = '';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }

  private createQueryParams(filters?: any): HttpParams {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] != null && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return params;
  }


  //get variable company
  getVariableCompany(): Observable<any> {
    return this.http.get(`${this.apiUrl}/settings/mobile.supplier_id/show/`, { headers: this.getAuthHeaders() });
  }

  // =====================================================
  // Listas de pedidos
  // =====================================================

  getShoppingLists(user_id: any, filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/shopping-lists?&order_by=created_at&direction=desc&filtros[user_id]=` + user_id, { headers: this.getAuthHeaders(), params });
  }

  getShoppingListSimpleDetail(cart_id?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/shopping-lists?option=first&filtros[id]=` + cart_id + '&with=items.productTemplate', { headers: this.getAuthHeaders() });
  }


  getShoppingListDetail(cart_id?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/shopping-list-new?option=get&direction=asc&order_by=shopping_list_id&filtros[shopping_list_id]=` + cart_id, { headers: this.getAuthHeaders() });
  }

  createShoppingList(list: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/shopping-lists`, list, { headers: this.getAuthHeaders() });
  }

  updateShoppingList(listId: string, list: any): Observable<any> {
    // calcular valor total de la lista de compra  sumano los precios de los productos list.items en su parte de presentation_price por quantity

    return this.http.put(`${this.apiUrl}/shopping-lists/${listId}`, list, { headers: this.getAuthHeaders() });
  }


  addItemList(list: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/shopping-lists/${list}/add`, data, { headers: this.getAuthHeaders() });
  }

  updateQuantityItemList(item: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/shopping-lists/${item}/quantity`, data, { headers: this.getAuthHeaders() });
  }



  deleteItemList(item: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/shopping-lists/${item}/remove`, { headers: this.getAuthHeaders() });
  }

  updateTotalList(item: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/shopping-lists/${item}/total`, data, { headers: this.getAuthHeaders() });
  }


  deleteShoppingList(listId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/shopping-lists/${listId}`, { headers: this.getAuthHeaders() });
  }

  changeShoppingListStatus(listId: string, status: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/shopping-lists/${listId}/status`, { is_active: status }, { headers: this.getAuthHeaders() });
  }

  // =====================================================
  // Órdenes
  // =====================================================
  getOrders(buyerable_id: any): Observable<any> {
    const url = `${this.apiUrl}/orders?&order_by=created_at&direction=desc&filtros[buyerable_id]=${buyerable_id}`;
    return this.http.get(url);
  }

  getOrdersDetail(id_order: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders?option=firsy&with=items&filtros[id]=` + id_order);
  }

  createNewOrder(listId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/shopping-lists/${listId}/order`, {}, { headers: this.getAuthHeaders() });
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order, { headers: this.getAuthHeaders() });
  }



  updateOrder(orderId: string, order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}`, order, { headers: this.getAuthHeaders() });
  }

  // =====================================================
  // Pagos
  // =====================================================

  getPayments(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/payments`, { headers: this.getAuthHeaders(), params });
  }

  // =====================================================
  // Actividades económicas
  // =====================================================

  getTaxClassifications(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/tax-classifications`, { headers: this.getAuthHeaders(), params });
  }

  // =====================================================
  // Productos: Categorías, Marcas y Presentaciones
  // =====================================================

  getCategories(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/categories`, { headers: this.getAuthHeaders(), params });
  }

  getBrands(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/brands`, { headers: this.getAuthHeaders(), params });
  }

  getProductPresentations(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/product-presentations`, { headers: this.getAuthHeaders(), params });
  }

  getProductFormats(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/product-format`, { headers: this.getAuthHeaders(), params });
  }

  // =====================================================
  // Productos
  // =====================================================

  // modificado para ser usado en el catalog
  getProducts(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    // Primero se obtiene la variable de la compañía, y luego se realiza el get de productos
    return this.getVariableCompany().pipe(
      switchMap(variableRes => {
        const companyId = variableRes.value; // Se asume que la respuesta contiene la propiedad "value"
        const filter = `product-templates-pos?filtros[company_id]=${companyId}&order_by=product_name&direction=asc&option=get&filtros[is_visible_refil]=true`;
        return this.http.get(`${this.apiUrl}/${filter}`, { headers: this.getAuthHeaders(), params });
      })
    );
  }

  getProductTemplates(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/product-templates-pos`, { headers: this.getAuthHeaders(), params });
  }

  // =====================================================
  // Compañías
  // =====================================================

  getCompanies(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/companies`, { headers: this.getAuthHeaders(), params });
  }


  // =====================================================
  // notificationes
  // =====================================================
  getNotifications(user_id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications?&filtros[is_read]=false&[user_id]=` + user_id, { headers: this.getAuthHeaders() });
  }

  readNotification(id_notification: any, data: any): Observable<any> {
    // Se cambia PUT por PATCH
    return this.http.patch(`${this.apiUrl}/notifications/` + id_notification, data, { headers: this.getAuthHeaders() });
  }

  postNotification(notification: any): Observable<any> {
    // Método para crear una nueva notificación
    return this.http.post(`${this.apiUrl}/notifications`, notification, { headers: this.getAuthHeaders() });
  }

  // METHOD PAYMENT
  getPaymentMethods(filters?: any): Observable<any> {
    const params = this.createQueryParams(filters);
    return this.http.get(`${this.apiUrl}/payment-methods?filtros[is_mobile]=true`, { headers: this.getAuthHeaders(), params });
  }
}
