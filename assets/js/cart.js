let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  let count = cart.length;
  ["cart-count", "cart-count2"].forEach(id => {
    let el = document.getElementById(id);
    if (el) el.innerText = count;
  });
}

//عر التفاصيل
document.querySelectorAll(".btn-details").forEach((button) => {
  button.addEventListener("click", function () {
    // جلب بيانات المنتج من الزر
    let name = this.dataset.name;
    let price = this.dataset.price;
    let image = this.dataset.image;
    let description = this.dataset.description;
    let sold = this.dataset.sold;
    let id = this.dataset.id;

    // ملء المودال بالبيانات
    document.getElementById("modalProductName").innerText = name;
    document.getElementById("modalProductImage").src = image;
    document.getElementById("modalProductDescription").innerText = description;
    document.getElementById("modalProductPrice").innerText = price + "$";
    document.getElementById("modalProductSold").innerText =
      sold + " عملية شراء";

    // تخزين البيانات للزر "أضف للسلة"
    let modalBtn = document.getElementById("modalAddToCart");
    modalBtn.dataset.id = id;
    modalBtn.dataset.name = name;
    modalBtn.dataset.price = price;
    modalBtn.dataset.image = image;

    // فتح المودال
    let modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  });
});

// نفذها فور تحميل الصفحة
updateCartCount();

let modalAddBtn = document.getElementById("modalAddToCart");

if (modalAddBtn) {
  modalAddBtn.addEventListener("click", function () {
    let product = {
      id: this.dataset.id,
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      image: this.dataset.image,
      quantity: 1,
    };

    let existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت إضافة المنتج 🛒");
    updateCartCount();
  });
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    let product = {
      id: this.dataset.id,
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      image: this.dataset.image,
      quantity: 1,
    };

    let existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت إضافة المنتج 🛒");
    updateCartCount();
  });
});

//----------------- shear
const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const product = {
      title: "اسم المنتج هنا",
      text: "تفضل هذا المنتج الرائع:",
      url: window.location.href, // رابط الصفحة الحالي
    };

    if (navigator.share) {
      try {
        await navigator.share(product);
        console.log("تمت المشاركة بنجاح!");
      } catch (err) {
        console.error("فشل المشاركة:", err);
      }
    } else {
      // fallback لو المتصفح لا يدعم Web Share API
      prompt("انسخ الرابط وشاركه مع أصدقائك:", product.url);
    }
  });
}

//-------------كود عرض السلة
document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartContainer = document.getElementById("cart-items");
  let totalContainer = document.getElementById("cart-total");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
      <div class="d-flex justify-content-center align-items-center flex-column" >
      <p class='text-center'>سلتك فارغة 💗</p>
      <a class="text-decoration-none" href="products.html">
      <button  class="btn btn-primary  d-flex justify-content-center gap-2  align-items-center" type="button" style="background: #d918ae;border-style: none; width:200px">تصفح  المنتجات<svg class="bi bi-arrow-left" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"></path>
    </svg></button>
    </a>

      <div>
      `;
      totalContainer.innerHTML = "";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      cartContainer.innerHTML += `
    <div class="card mb-4 p-3 shadow-sm rounded-4">
      <div class="row align-items-center gap-2 gap-md-0">

        <div class="col-md-2 text-center">
          <img src="${item.image}" class="img-fluid rounded-3" width="80">
        </div>

        <div class="col-md-3">
          <h5>${item.name}</h5>
        </div>

        <div class="col-md-2 text-success fw-bold">
          ${item.price} ريال
        </div>

        <div class="col-md-3 d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="decrease(${index})">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="increase(${index})">+</button>
        </div>

        <div class="col-md-2 text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">
            حذف
          </button>
        </div>

      </div>
    </div>
    `;
    });

    totalContainer.innerHTML = `
  <div class="card p-4 rounded-4 shadow-sm text-center">
    <h4>المجموع الكلي</h4>
    <h3 class="text-success">${total.toFixed(2)} ريال</h3>
    <button class="btn btn-primary mt-3 px-5 rounded-pill">
      إتمام الطلب 
    </button>
  </div>
  `;
  }

  window.increase = function (index) {
    cart[index].quantity++;
    saveCart();
    renderCart();
    updateCartCount();
  };

  window.decrease = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    saveCart();
    renderCart();
    updateCartCount();
  };

  window.removeItem = function (index) {
    if (confirm("هل تريد بالفعل الحذف من السلة ؟")) {
      cart.splice(index, 1);
      saveCart();
      renderCart();
      updateCartCount();
    }
  };

  renderCart();
});
