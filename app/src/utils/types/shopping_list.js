import { Alert } from "react-native";

class ShoppingItem {
    id;
    name;
    quantity;
    unit;
    is_purchased;

    constructor({id, name, quantity, unit, is_purchased}) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.is_purchased = is_purchased
    }

    getData() {
        return {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            unit: this.unit,
            is_purchased: this.is_purchased
        }
    }

    add = {
        data: async (userToken) => {
            const response = await fetch(`http://10.0.2.2:4000/api/shopping-list`, {
                method: 'POST',
                headers: {
                    "authorization": `Bearer ${userToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.getData())
            });

            const body = await response.json();

            if (!response.ok) {
                Alert.alert("Error", body.message);
                return false;
            }

            this.id = body.data.item.id;
            return true;
        }
    }

    edit = {
        data: async (userToken, newItemData) => {
            const response = await fetch(`http://10.0.2.2:4000/api/shopping-list/${this.id}`, {
                method: 'PUT',
                headers: {
                    "authorization": `Bearer ${userToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newItemData)
            });

            if (!response.ok) {
                Alert.alert("Error", (await response.json()).message);
                return false;
            }
            return true;
        }
    };

    delete = {
        data: async (userToken) => {
            const response = await fetch(`http://10.0.2.2:4000/api/shopping-list/${this.id}`, {
                method: 'DELETE',
                headers: {
                    "authorization": `Bearer ${userToken}`,
                },
            });
            if (!response.ok) {
                Alert.alert("Error", (await response.json()).message);
                return false;
            }
            return true;
        }
    };
}
export default ShoppingItem;