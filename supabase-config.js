/* Sweet Home Mousse's
   Cupom BOASVINDAS + taxa de entrega por bairro
*/

(function () {
  const DELIVERY = {
    "baianao": 6,
    "casas novas": 7,
    "parque ecologico": 7,
    "areal itapua": 7,
    "fontana": 8,
    "parque ecologico 2 3 sesc": 8,
    "cambolo": 8,
    "quinta do descobrimento": 8,
    "mirante": 8,
    "paraguai": 8,
    "valdete": 8,
    "parracho": 8,
    "belo campo": 8,
    "vista alegre": 8,
    "rio da vila": 9,
    "riacho doce": 9,
    "vila verde": 10,
    "aeronautica": 10,
    "vila vitoria": 10,
    "camboata": 10,
    "vila jardim": 14,
    "porto alegre i ii": 14,
    "roca do povo": 15,
    "tabapiri": 12,
    "rodoviaria aeroporto": 13,
    "cidade historica": 13,
    "centro campinho": 15,
    "outeiro da gloria": 12,
    "outeiro sao francisco": 14,
    "gaudi": 12,
    "padova olhos dagua": 10,
    "praia do curuipe": 14,
    "mundai baixo": 16,
    "mundai alto": 16,
    "taperapuan": 18,
    "xurupita": 18,
    "village i": 18,
    "village ii iii": 20,
    "pataxos": 20,
    "miramar": 30,
    "ponta grande": 25,
    "coroa vermelha": 40,
    "cabralia": 70,
    "mangabeira monte das oliveiras": 18,
    "cond faisao ufsb": 22,
    "faculdade atenas porto bello": 18,
    "agrovila": 30,
    "arraial baixo": 75,
    "arraial alto": 85
  };

  function normalize(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[\/,&.-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function deliveryFee() {
    const field = document.getElementById("neighborhood");
    const saved = JSON.parse(localStorage.getItem("sh_customer") || "{}");

    const neighborhood =
      (field && field.value) ||
      saved.neighborhood ||
      "";

    const n = normalize(neighborhood);

    if (!n) return 0;

    if (DELIVERY[n] !== undefined) {
      return DELIVERY[n];
    }

    /* Correspondências alternativas */
    if (n.includes("baianao")) return 6;
    if (n.includes("casas novas")) return 7;
    if (n.includes("parque ecologico")) return 7;
    if (n.includes("areal")) return 7;
    if (n.includes("fontana")) return 8;
    if (n.includes("cambolo")) return 8;
    if (n.includes("quinta do descobrimento")) return 8;
    if (n.includes("valdete")) return 8;
    if (n.includes("parracho")) return 8;
    if (n.includes("belo campo")) return 8;
    if (n.includes("vista alegre")) return 8;
    if (n.includes("rio da vila")) return 9;
    if (n.includes("riacho doce")) return 9;
    if (n.includes("vila verde")) return 10;
    if (n.includes("aeronautica")) return 10;
    if (n.includes("vila vitoria")) return 10;
    if (n.includes("camboata")) return 10;
    if (n.includes("vila jardim")) return 14;
    if (n.includes("porto alegre")) return 14;
    if (n.includes("roca do povo")) return 15;
    if (n.includes("tabapiri")) return 12;
    if (n.includes("rodoviaria")) return 13;
    if (n.includes("aeroporto")) return 13;
    if (n.includes("cidade historica")) return 13;
    if (n.includes("centro")) return 15;
    if (n.includes("campinho")) return 15;
    if (n.includes("outeiro da gloria")) return 12;
    if (n.includes("outeiro sao francisco")) return 14;
    if (n.includes("gaudi")) return 12;
    if (n.includes("padova")) return 10;
    if (n.includes("curuipe")) return 14;
    if (n.includes("mundai baixo")) return 16;
    if (n.includes("mundai alto")) return 16;
    if (n.includes("taperapuan")) return 18;
    if (n.includes("xurupita")) return 18;
    if (n.includes("village i")) return 18;
    if (n.includes("village ii") || n.includes("village iii")) return 20;
    if (n.includes("pataxos")) return 20;
    if (n.includes("miramar")) return 30;
    if (n.includes("ponta grande")) return 25;
    if (n.includes("coroa vermelha")) return 40;
    if (n.includes("cabralia")) return 70;
    if (n.includes("mangabeira")) return 18;
    if (n.includes("monte das oliveiras")) return 18;
    if (n.includes("faisao") || n.includes("ufsb")) return 22;
    if (n.includes("faculdade atenas")) return 18;
    if (n.includes("porto bello")) return 18;
    if (n.includes("agrovila")) return 30;
    if (n.includes("arraial baixo")) return 75;
    if (n.includes("arraial alto")) return 85;

    return 0;
  }

  function couponDiscount() {
    if (typeof getCartSubtotal !== "function") return 0;

    const subtotal = Number(getCartSubtotal()) || 0;

    if (typeof appliedCoupon !== "undefined" &&
        appliedCoupon &&
        String(appliedCoupon.code).toUpperCase() === "BOASVINDAS") {
      return Math.min(10, subtotal);
    }

    return 0;
  }

  function totalWithDelivery() {
    const subtotal =
      typeof getCartSubtotal === "function"
        ? Number(getCartSubtotal()) || 0
        : 0;

    return Math.max(
      0,
      subtotal - couponDiscount() + deliveryFee()
    );
  }

  /* Cupom BOASVINDAS */
  window.applyCoupon = function () {
    const input = document.getElementById("couponInput");
    const msg = document.getElementById("couponMessage");

    const code = String(input?.value || "")
      .trim()
      .toUpperCase();

    if (!code) {
      appliedCoupon = null;
      localStorage.removeItem("sh_coupon");

      if (msg) {
        msg.textContent = "";
        msg.className = "couponMessage";
      }

      renderCart();
      return;
    }

    if (code === "BOASVINDAS") {
      appliedCoupon = {
        code: "BOASVINDAS",
        active: true,
        discount_type: "fixed",
        discount_value: 10,
        min_order: 0
      };

      localStorage.setItem(
        "sh_coupon",
        JSON.stringify(appliedCoupon)
      );

      if (msg) {
        msg.textContent = "✅ BOASVINDAS aplicado — R$ 10,00 de desconto";
        msg.className = "couponMessage ok";
      }

      renderCart();
      return;
    }

    if (msg) {
      msg.textContent = "❌ Cupom inválido ou indisponível.";
      msg.className = "couponMessage error";
    }
  };

  window.getAppliedDiscount = function () {
    return couponDiscount();
  };

  window.getCartTotal = function () {
    return totalWithDelivery();
  };

  /* Atualiza o carrinho */
  const originalRenderCart = window.renderCart;

  window.renderCart = function () {
    if (typeof originalRenderCart === "function") {
      originalRenderCart();
    }

    const total = document.getElementById("total");

    if (total && typeof getCartSubtotal === "function") {
      const subtotal = Number(getCartSubtotal()) || 0;
      const discount = couponDiscount();
      const delivery = deliveryFee();
      const finalTotal = Math.max(
        0,
        subtotal - discount + delivery
      );

      total.innerHTML =
        `<span style="font-size:11px;color:#777;font-weight:600">
          Subtotal ${money(subtotal)}
          ${discount ? `<br><span class="discountRow">− Cupom ${money(discount)}</span>` : ""}
          ${delivery ? `<br>🚚 Entrega ${money(delivery)}` : ""}
        </span>
        <strong>${money(finalTotal)}</strong>`;
    }
  };

  /* Checkout */
  window.fillCheckout = function () {
    const saved =
      JSON.parse(localStorage.getItem("sh_customer") || "{}");

    for (const id of [
      "customerName",
      "address",
      "number",
      "neighborhood",
      "reference",
      "notes"
    ]) {
      const el = document.getElementById(id);

      if (el && saved[id]) {
        el.value = saved[id];
      }
    }

    if (saved.payment) {
      const radio = document.querySelector(
        `input[name="payment"][value="${CSS.escape(saved.payment)}"]`
      );

      if (radio) radio.checked = true;
    }

    const subtotal =
      typeof getCartSubtotal === "function"
        ? Number(getCartSubtotal()) || 0
        : 0;

    const discount = couponDiscount();
    const delivery = deliveryFee();
    const total = Math.max(
      0,
      subtotal - discount + delivery
    );

    const summary = document.getElementById("checkoutSummary");

    if (summary) {
      summary.innerHTML =
        cart.map(x =>
          `<div class="checkoutSummaryRow">
            <span>${x.qty}x ${x.name}</span>
            <strong>${money(x.price * x.qty)}</strong>
          </div>`
        ).join("") +

        `<div class="checkoutSummaryRow">
          <span>Subtotal</span>
          <strong>${money(subtotal)}</strong>
        </div>` +

        (discount
          ? `<div class="checkoutSummaryRow discountRow">
              <span>🎟️ Cupom BOASVINDAS</span>
              <strong>− ${money(discount)}</strong>
            </div>`
          : "") +

        `<div class="checkoutSummaryRow">
          <span>🚚 Taxa de entrega</span>
          <strong>${delivery ? money(delivery) : "Informe o bairro"}</strong>
        </div>

        <div class="checkoutSummaryRow totalRow">
          <span>Total</span>
          <span>${money(total)}</span>
        </div>`;
    }

    const couponLine =
      document.getElementById("checkoutCouponLine");

    if (couponLine) {
      couponLine.textContent =
        discount
          ? `BOASVINDAS — desconto de ${money(discount)} aplicado.`
          : "Nenhum cupom aplicado.";
    }
  };

  /* WhatsApp com entrega incluída */
  window.sendOrder = function (e) {
    e.preventDefault();

    if (!cart.length) return;

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    const payment =
      document.querySelector(
        'input[name="payment"]:checked'
      )?.value;

    if (!payment) {
      alert("Escolha uma forma de pagamento.");
      return;
    }

    data.payment = payment;

    localStorage.setItem(
      "sh_customer",
      JSON.stringify(data)
    );

    const subtotal =
      typeof getCartSubtotal === "function"
        ? Number(getCartSubtotal()) || 0
        : 0;

    const discount = couponDiscount();

    const delivery = deliveryFee();

    const total = Math.max(
      0,
      subtotal - discount + delivery
    );

    const lines = cart.map(x =>
      `• ${x.qty}x ${x.name} — ${money(x.price * x.qty)}`
    ).join("\n");

    const address = [
      data.address,
      data.number,
      data.neighborhood
    ].filter(Boolean).join(", ");

    let msg =
      `Olá, Sweet Home Mousse's! 💕\n\n` +
      `Quero fazer este pedido:\n${lines}\n\n` +
      `Subtotal: ${money(subtotal)}\n`;

    if (discount) {
      msg +=
        `🎟️ Cupom: BOASVINDAS\n` +
        `💸 Desconto: ${money(discount)}\n`;
    }

    if (data.neighborhood) {
      msg +=
        `🚚 Taxa de entrega: ${money(delivery)}\n`;
    }

    msg +=
      `💰 Total: ${money(total)}\n\n` +
      `👤 Nome: ${data.name}\n` +
      `📍 Endereço: ${address}\n`;

    if (data.reference) {
      msg += `📌 Referência: ${data.reference}\n`;
    }

    msg += `💳 Pagamento: ${data.payment}`;

    if (data.notes) {
      msg += `\n📝 Observação: ${data.notes}`;
    }

    window.open(
      "https://wa.me/5573982251593?text=" +
      encodeURIComponent(msg),
      "_blank"
    );

    if (typeof showCheckoutSuccess === "function") {
      showCheckoutSuccess();
    }
  };

  /* Recalcula quando o cliente escolhe/digita o bairro */
  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "neighborhood") {
      setTimeout(function () {
        if (typeof fillCheckout === "function") {
          fillCheckout();
        }

        if (typeof renderCart === "function") {
          renderCart();
        }
      }, 50);
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "neighborhood") {
      setTimeout(function () {
        if (typeof fillCheckout === "function") {
          fillCheckout();
        }

        if (typeof renderCart === "function") {
          renderCart();
        }
      }, 50);
    }
  });

  /* Espera o index.html terminar de carregar as funções */
  setTimeout(function () {
    if (typeof renderCart === "function") {
      renderCart();
    }
  }, 100);

})();
