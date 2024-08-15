import React, { useState, useEffect } from 'react';
import './App.css';
import shoppingBag from "./assets/shoppingBag.svg"
import carbonTree from "./assets/carbon_tree.svg"
import empty from "./assets/emptyImg.png"
import vector from "./assets/Vector.svg"
import deleteBtn from "./assets/deleteBtn.svg"




function App() {
  const [products, setProducts] = useState([]);
  const [basketProducts, setBasketProducts] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.czaylabs.com.tr/api/products')
      .then(res => res.json())
      .then(res => setProducts(res.data));
  }, []);

  const addProductBasket = (product) => {
    const basketItem = basketProducts.find(x => x.id === product.id);
    if (basketItem) {
      setBasketProducts(basketProducts.map(x =>
        x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
      ));
    } else {
      setBasketProducts([...basketProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProductBasket = (id) => {
    setBasketProducts(basketProducts.filter(x => x.id !== id));
  };

  const clearBasket = () => {
    setBasketProducts([]);
  };

  return (
    <div className="container">
      <ProductList products={products} onAddProduct={addProductBasket} />
      <Cart
        basketProducts={basketProducts}
        onRemoveProduct={removeProductBasket}
        onClearBasket={clearBasket}
      />
    </div>
  );
}

function ProductList({ products, onAddProduct }) {
  return (
    <div className="dessertContainer">
      <h2>Desserts</h2>
      <div className="productList">
        {products.map(product => (
          <Product key={product.id} product={product} onAddProduct={onAddProduct} />
        ))}
      </div>
    </div>
  );
}

function Product({ product, onAddProduct }) {
  return (
    <div className="dessert">
      <div className="dessertArea">
        <img src={product.image.desktop} alt={product.name} />
        <button onClick={() => onAddProduct(product)}>
          <img className="shoppingBag" src={shoppingBag} alt="Shopping Bag" />
          <span className='addToCart'>Add to Cart</span>
        </button>
      </div>
      <div className="info">
        <h3>{product.name}</h3>
        <h4>${product.price}</h4>
        <p>{product.category}</p>
      </div>
    </div>
  );
}

function Cart({ basketProducts, onRemoveProduct, onClearBasket }) {
  const calculateSalesTotal = () => {
    return basketProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const calculateQuantityTotal = () => {
    return basketProducts.reduce((total, product) => total + product.quantity, 0);
  };

  return (
    <div className="basketCart">
      <h2>Your Cart ({calculateQuantityTotal()})</h2>
      <div className="cart">
        {basketProducts.length === 0 ? (
          <div className="empty-cart emptyCartMessage">
            <img src={empty} alt="Empty Cart" />
            <p>Your added items will appear here</p>
          </div>
        ) : (
          basketProducts.map(product => (
            <CartItem key={product.id} product={product} onRemove={() => onRemoveProduct(product.id)} />
          ))
        )}
      </div>
      <div className="orderTotal">
        <h6><span>Order Total:</span> ${calculateSalesTotal()}</h6>
        <div className="carbonNeutral">
          <img src={carbonTree} />
          <p> This is a <strong>carbon-neutral</strong> delivery </p>
        </div>
      </div>
      <OrderModal basketProducts={basketProducts} salesTotal={calculateSalesTotal()} onClearBasket={onClearBasket} />
    </div>
  );
}

function CartItem({ product, onRemove }) {
  return (
    <div className="productBasketBox">
      <div className="basket">
        <div className="productBox">
          <h3>{product.name}</h3>
          <h4>{product.quantity}x <span>@ ${product.price}<span>${product.quantity * product.price}</span></span></h4>
        </div>
        <a onClick={onRemove} href="#" className="deleteBtn"><img src={deleteBtn} /></a>
      </div>
    </div>
  );
}

function OrderModal({ basketProducts, salesTotal, onClearBasket }) {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmOrder = () => {
    setShowModal(true);
  };

  const handleResetOrder = () => {
    setShowModal(false);
    onClearBasket();
  };

  return (
    <>
      <button onClick={handleConfirmOrder} className="addBtn">Confirm Order</button>
      {showModal && (
        <>
          <div className="modal-overlay">
            <dialog className="modal" open>
              <img src={vector} alt="Check Mark" />
              <h2>Order Confirmed</h2>
              <p>We hope you enjoy your food!</p>
              <div className="modalList">
                {basketProducts.map(product => (
                  <div key={product.id} className="productBasketBox">
                    <div className="basket">
                      <img src={product.image.thumbnail} alt={product.name} />
                      <div className="productBox">
                        <h3>{product.name}</h3>
                        <h4>{product.quantity}x <span>@ ${product.price}</span></h4>
                      </div>
                      <h4>${product.quantity * product.price}</h4>
                    </div>
                  </div>
                ))}
                <h6 className="orderSales">Order Total: ${salesTotal}</h6>
              </div>
              <button onClick={handleResetOrder} className="resetBtn">Start New Order</button>
            </dialog>
          </div>
        </>
      )}
    </>
  );
}


export default App;
