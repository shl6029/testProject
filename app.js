let isLoggedIn = false; // 로그인 상태를 추적

const loadData = async function () {
    try {
        
        const [loginUserRes, productsRes] = await Promise.all([
            fetch("./loginUser.json"),
            fetch("./products.json"),
        ]);

        const [loginUser, products] = await Promise.all([
            loginUserRes.json(),
            productsRes.json(),
        ]);

        console.log("로그인 유저:", loginUser);
        console.log("상품 목록:", products);

        // 로그인 버튼 이벤트
        document.getElementById("login-btn").addEventListener("click", () => {
            alert(`로그인 유저: ${loginUser.name} (${loginUser.email})`);
            isLoggedIn = true; // 로그인 상태를 true로 변경
        });

        
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        products.forEach((product) => {
            const productItem = document.createElement("li");
            productItem.innerHTML = `
                <div>
                    <img class="img" src="${product["img[src]"]}" alt="${product.title}">
                </div>
                <form name="a" action="#" class="basketForm">
                    <h4 class="title">${product.title}</h4>
                    <p><span class="price">${product.price}</span>원</p>
                    <p>
                        <label>수량 : 
                            <input name="cnt" type="number" min="1" max="10" value="1">
                        </label>
                    </p>
                    <p>
                        <input type="hidden" name="num" value="${product.num}">
                        <input type="hidden" name="title" value="${product.title}">
                        <input type="hidden" name="price" value="${product.price}">
                        <button type="submit">장바구니</button>
                        <button type="button">바로구매</button>
                    </p>
                </form>
            `;
            productList.appendChild(productItem);

            
            productItem.querySelector("form.basketForm").addEventListener("submit", (e) => {
                e.preventDefault();
                addToBasket(e.target);
            });
        });

        
        document.getElementById("loadProductsBtn").addEventListener("click", async () => {
            if (!isLoggedIn) {
                alert("로그인 후 이용 가능합니다.");
                return;
            }

            try {
                let res3 = await fetch(`./${loginUser.user_id}Baskets.json`);
                let basketsData = await res3.json();

                console.log("장바구니:", basketsData);

                renderBasket(basketsData.baskets);
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
                alert("장바구니 데이터를 불러오는 중 오류가 발생했습니다.");
            }
        });
    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
    }
};


const addToBasket = (form) => {
    const cnt = parseInt(form.cnt.value, 10);
    const num = parseInt(form.num.value, 10);
    const title = form.title.value;
    const price = parseInt(form.price.value, 10);
    const total = cnt * price;

    const basketCont = document.getElementById("basketCont");

    const basketRow = document.createElement("tr");
    basketRow.innerHTML = `
        <td class="num">${num}</td>
        <td class="title">${title}</td>
        <td class="price">${price}</td>
        <td class="cnt">${cnt}</td>
        <td class="total">${total}</td>
        <td>
            <button class="delBtn">삭제</button>
        </td>
    `;
    basketCont.appendChild(basketRow);

    basketRow.querySelector(".delBtn").addEventListener("click", () => {
        basketRow.remove();
        updateTotalPrice();
    });

    updateTotalPrice();
};


const renderBasket = (baskets) => {
    const basketCont = document.getElementById("basketCont");
    basketCont.innerHTML = "";

    baskets.forEach((basket) => {
        const basketRow = document.createElement("tr");
        basketRow.innerHTML = `
            <td class="num">${basket.num}</td>
            <td class="title">${basket.title}</td>
            <td class="price">${basket.price}</td>
            <td class="cnt">${basket.cnt}</td>
            <td class="total">${basket.total}</td>
            <td>
                <button class="delBtn">삭제</button>
            </td>
        `;
        basketCont.appendChild(basketRow);

        basketRow.querySelector(".delBtn").addEventListener("click", () => {
            basketRow.remove();
            updateTotalPrice();
        });
    });

    updateTotalPrice();
};


const updateTotalPrice = () => {
    const basketRows = document.querySelectorAll("#basketCont tr");
    let totalPrice = 0;

    basketRows.forEach((row) => {
        const totalCell = row.querySelector(".total");
        if (totalCell) {
            totalPrice += parseInt(totalCell.textContent, 10);
        }
    });

    document.getElementById("totalPriceB").innerText = totalPrice;
};


loadData();
