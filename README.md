# 🧪 Front-End Technical Assessment

**Frameworks:** Angular 14, Ionic 7  
**Estimated Time:** 1–2 days  
**Submission Platform:** [StackBlitz](https://stackblitz.com/) or GitHub

---

## 📘 Scenario Overview

You're building a simplified **Investment Dashboard** app. The app contains three key views:

1. **Portfolio** – shows the user’s current investment breakdown  
2. **Market** – lists available investment products  
3. **Detail** – shows more information about a product and allows the user to add it to their portfolio

---

## ✅ Requirements

### 1. App Setup

- Use **Angular 14** and **Ionic 7**
- Responsive design and structured file layout

### 2. Tab Structure

- Implement using `ion-tabs` with:
  - **Portfolio** tab
  - **Market** tab

---

## 📊 Functional Requirements

### Portfolio Tab

- Displays user’s current investments (from **your own mocked data**)
- Each investment should show:
  - Investment name
  - Investment amount
  - Percentage of total portfolio

### Market Tab

- Displays a list of available investment products (from **mocked data found in file dummy-data.json**)
- Each product should include:
  - Name
  - Price
  - Description
  - **Buy** button

- Clicking on a product should:
  - Navigate to a **Detail Page**
  - Display full details
  - Allow the user to "Buy" and add the investment to their portfolio
  - Update the portfolio totals accordingly

---

## 🧰 Technical Areas to Consider

### State Management

- Consider using `BehaviorSubject` or service-based approaches

### RxJS Logic

- Correct use of operators to handle data flow, tab sync, and UI updates

### Styling

- Apply theming with Ionic variables  
- Use skeleton loaders where applicable  
- Focus on polish, spacing, and UX consistency

---

## ✨ Bonus Ideas (mid-senior levels)

- Add **search**, **filter**, or **pagination** to the Market list  
- Animate the portfolio when new items are added (e.g. market open effect)  
- Add **visual feedback** when a new investment is added  
- Come up with your own enhancements or features

---

## 🚫 What to Avoid

- Do not include references to Stake developers or real company code
- Focus on your best practices, clean code, and component architecture

---

## 📎 Submission

- Please host your project on [StackBlitz](https://stackblitz.com/) or provide a GitHub repo link
- Include a short note if you added any bonus or unique ideas

---

## 🧾 (Internal Use)

- [Review focus](https://hello-stake.atlassian.net/wiki/spaces/DEV/pages/2172747777/Code+Review+Focus+internal+use+only)
- [Assessment notes](https://hello-stake.atlassian.net/wiki/spaces/DEV/pages/2172452872/Reviewer+Notes+-+Front-End+Assessment)
