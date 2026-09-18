/* Sweet Home Mousse's
   CUPOM + TAXAS DE ENTREGA
*/

(function () {

  const TAXAS = {
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
    "porto alegre": 14,
    "roca do povo": 15,
    "tabapiri": 12,
    "rodoviaria": 13,
    "aeroporto": 13,
    "cidade historica": 13,

    "centro": 15,
    "campinho": 15,

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
    "village ii": 20,
    "village iii": 20,
    "pataxos": 20,

    "miramar": 30,
    "ponta grande": 25,
    "coroa vermelha": 40,
    "cabralia": 70,

    "mangabeira": 18,
    "monte das oliveiras": 18,

    "faisao": 22,
    "ufsb": 22,

    "faculdade atenas": 18,
    "porto bello": 18,

    "agrovila": 30,

    "arraial baixo": 75,
    "arraial alto": 85
  };


  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[\/,&.-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  function obterBairro() {
    const campo = document.getElementById("neighborhood");

    if (campo && campo.value) {
      return campo.value;
    }

    try {
      const salvo =
        JSON.parse(localStorage.getItem("sh_customer") || "{}");

      return salvo.neighborhood || "";
    } catch (e) {
      return "";
    }
  }


  function obterTaxa() {

    const bairro = normalizar(obterBairro());

    if (!bairro) {
      return 0;
    }

    /* Correspondências exatas */
    if (TAXAS[bairro] !== undefined) {
      return TAXAS[bairro];
    }

    /* Correspondências por nome */
    for (const nome in TAXAS) {
      if (bairro.includes(nome)) {
        return TAXAS[nome];
      }
    }

    return 0;
  }


  function obterDesconto() {

    if (typeof getCartSubtotal !== "function") {
      return 0;
    }

    const subtotal = Number(getCartSubtotal()) || 0;

    try {
      const cupom =
        typeof appliedCoupon !== "undefined"
          ? appliedCoupon
          : null;

      if (
        cupom &&
        String(cupom.code || "").toUpperCase() === "BOASVINDAS"
      ) {
        return Math.min(10, subtotal);
      }

    } catch (e) {}

    return 0;
  }


  function calcularTotal() {

    const subtotal =
      typeof getCartSubtotal === "function"
        ? Number(getCartSubtotal()) || 0
        : 0;

    const desconto = obterDesconto();
    const entrega = obterTaxa();

    return Math.max(
      0,
      subtotal - desconto + entrega
    );
  }


  /*
   * Espera o index.html terminar de carregar.
   * Isso é importante porque o seu site declara
   * as funções do carrinho depois deste arquivo.
   */

  document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CUPOM BOASVINDAS
       ========================= */

    window.applyCoupon = function () {

      const input =
        document.getElementById("couponInput");

      const mensagem =
        document.getElementById("couponMessage");

      const codigo =
        String(input?.value || "")
          .trim()
          .toUpperCase();


      if (!codigo) {

        appliedCoupon = null;

        localStorage.removeItem("sh_coupon");

        if (mensagem) {
          mensagem.textContent = "";
          mensagem.className = "couponMessage";
        }

        window.renderCart();
        return;
      }


      if (codigo === "BOASVINDAS") {

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


        if (mensagem) {
          mensagem.textContent =
            "✅ BOASVINDAS aplicado — R$ 10,00 de desconto";

          mensagem.className =
            "couponMessage ok";
        }


        window.renderCart();
        return;
      }


      if (mensagem) {

        mensagem.textContent =
          "❌ Cupom inválido ou indisponível.";

        mensagem.className =
          "couponMessage error";
      }

    };


    /* =========================
       DESCONTO
       ========================= */

    window.getAppliedDiscount = function () {
      return obterDesconto();
    };


    /* =========================
       TOTAL
       ========================= */

    window.getCartTotal = function () {
      return calcularTotal();
    };


    /* =========================
       CARRINHO
       ========================= */

    const renderOriginal =
      window.renderCart;


    window.renderCart = function () {

      if (typeof renderOriginal === "function") {
        renderOriginal();
      }


      const elemento =
        document.getElementById("total");

      if (!elemento ||
          typeof getCartSubtotal !== "function") {
        return;
      }


      const subtotal =
        Number(getCartSubtotal()) || 0;

      const desconto =
        obterDesconto();

      const entrega =
        obterTaxa();

      const total =
        Math.max(
          0,
          subtotal - desconto + entrega
        );


      let detalhes =
        `<span style="font-size:11px;color:#777;font-weight:600">
          Subtotal ${money(subtotal)}`;


      if (desconto > 0) {
        detalhes +=
          `<br><span class="discountRow">
            − Cupom ${money(desconto)}
          </span>`;
      }


      if (entrega > 0) {
        detalhes +=
          `<br>🚚 Entrega ${money(entrega)}`;
      }


      detalhes +=
        `</span>
         <strong>${money(total)}</strong>`;


      elemento.innerHTML = detalhes;
    };


    /* =========================
       CHECKOUT
       ========================= */

    window.fillCheckout = function () {

      let salvo = {};

      try {
        salvo =
          JSON.parse(
            localStorage.getItem("sh_customer") || "{}"
          );
      } catch (e) {}


      [
        "customerName",
        "address",
        "number",
        "neighborhood",
        "reference",
        "notes"
      ].forEach(function (id) {

        const campo =
          document.getElementById(id);

        if (campo && salvo[id]) {
          campo.value = salvo[id];
        }

      });


      if (salvo.payment) {

        const radio =
          document.querySelector(
            `input[name="payment"][value="${CSS.escape(salvo.payment)}"]`
          );

        if (radio) {
          radio.checked = true;
        }

      }


      const subtotal =
        Number(getCartSubtotal()) || 0;

      const desconto =
        obterDesconto();

      const entrega =
        obterTaxa();

      const total =
        Math.max(
          0,
          subtotal - desconto + entrega
        );


      const resumo =
        document.getElementById("checkoutSummary");


      if (resumo) {

        resumo.innerHTML =

          cart.map(function (item) {

            return `
              <div class="checkoutSummaryRow">
                <span>
                  ${item.qty}x ${item.name}
                </span>

                <strong>
                  ${money(item.price * item.qty)}
                </strong>
              </div>
            `;

          }).join("") +

          `
          <div class="checkoutSummaryRow">
            <span>Subtotal</span>
            <strong>${money(subtotal)}</strong>
          </div>
          ` +

          (
            desconto > 0
              ? `
              <div class="checkoutSummaryRow discountRow">
                <span>🎟️ Cupom BOASVINDAS</span>
                <strong>− ${money(desconto)}</strong>
              </div>
              `
              : ""
          ) +

          `
          <div class="checkoutSummaryRow">
            <span>🚚 Taxa de entrega</span>
            <strong>
              ${
                entrega > 0
                  ? money(entrega)
                  : "Informe o bairro"
              }
            </strong>
          </div>

          <div class="checkoutSummaryRow totalRow">
            <span>Total</span>
            <span>${money(total)}</span>
          </div>
          `;

      }


      const linhaCupom =
        document.getElementById(
          "checkoutCouponLine"
        );


      if (linhaCupom) {

        linhaCupom.textContent =
          desconto > 0
            ? `BOASVINDAS — desconto de ${money(desconto)} aplicado.`
            : "Nenhum cupom aplicado.";

      }

    };


    /* =========================
       WHATSAPP
       ========================= */

    window.sendOrder = function (evento) {

      evento.preventDefault();


      if (!cart.length) {
        return;
      }


      const formulario =
        new FormData(evento.target);

      const dados =
        Object.fromEntries(formulario.entries());


      const pagamento =
        document.querySelector(
          'input[name="payment"]:checked'
        )?.value;


      if (!pagamento) {

        alert(
          "Escolha uma forma de pagamento."
        );

        return;
      }


      dados.payment = pagamento;


      localStorage.setItem(
        "sh_customer",
        JSON.stringify(dados)
      );


      const subtotal =
        Number(getCartSubtotal()) || 0;

      const desconto =
        obterDesconto();

      const entrega =
        obterTaxa();

      const total =
        Math.max(
          0,
          subtotal - desconto + entrega
        );


      const itens =
        cart.map(function (item) {

          return (
            `• ${item.qty}x ${item.name} — ` +
            `${money(item.price * item.qty)}`
          );

        }).join("\n");


      const endereco = [
        dados.address,
        dados.number,
        dados.neighborhood
      ].filter(Boolean).join(", ");


      let mensagem =
        `Olá, Sweet Home Mousse's! 💕\n\n` +
        `Quero fazer este pedido:\n` +
        `${itens}\n\n` +
        `Subtotal: ${money(subtotal)}\n`;


      if (desconto > 0) {

        mensagem +=
          `🎟️ Cupom: BOASVINDAS\n` +
          `💸 Desconto: ${money(desconto)}\n`;

      }


      if (dados.neighborhood) {

        mensagem +=
          `🚚 Taxa de entrega: ${money(entrega)}\n`;

      }


      mensagem +=
        `💰 Total: ${money(total)}\n\n` +
        `👤 Nome: ${dados.name}\n` +
        `📍 Endereço: ${endereco}\n`;


      if (dados.reference) {

        mensagem +=
          `📌 Referência: ${dados.reference}\n`;

      }


      mensagem +=
        `💳 Pagamento: ${dados.payment}`;


      if (dados.notes) {

        mensagem +=
          `\n📝 Observação: ${dados.notes}`;

      }


      window.open(
        "https://wa.me/5573982251593?text=" +
        encodeURIComponent(mensagem),
        "_blank"
      );


      if (
        typeof showCheckoutSuccess === "function"
      ) {
        showCheckoutSuccess();
      }

    };


    /* =========================
       ATUALIZAÇÃO DO BAIRRO
       ========================= */

    const bairro =
      document.getElementById("neighborhood");


    if (bairro) {

      ["input", "change"].forEach(function (evento) {

        bairro.addEventListener(
          evento,
          function () {

            window.fillCheckout();
            window.renderCart();

          }
        );

      });

    }


    /* Primeira atualização */
    window.renderCart();

  });

})();
