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
- For junior to mid level roles who do not feel comfortable incorporating Ionic, please set up your Angular project using a "menu" approach

### 2. Tab/Page Structure

- Implement using `ion-tabs` with:
  - **Portfolio** tab
  - **Market** tab
- Non ionic equivalent - implement a menu
  - **Portfolio** menu item
  - **Market** menu item

---

## 📊 Functional Requirements

### Portfolio Tab/Page

- Displays user’s current investments (from **portfolio-list.json**)
- Each investment should show:
  - Investment symbol
  - Investment amount
  - Percentage of total portfolio

### Market Tab/Page

- Displays a list of available investment products 
- Each product should include:
  - Name
  - Symbol
  - Price

- Clicking on a product should:
  - Navigate to a **Detail Page**
  - Display full details
  - Allow the user to "Buy" and add the investment to their portfolio
  - Update their portfolio totals accordingly
 
### Relevant dummy data

1. List of instruments **instrument-list.json**
2. Portfolio **portfolio.json**
3. Pricing data **pricing.json**

---

## 🧰 Technical Areas to Consider (based on level)

### State Management

- Consider using `BehaviorSubject` or service-based approaches

### RxJS Logic

- Correct use of operators to handle data flow, tab/page sync, and UI updates

### Styling

- Don’t forget: polish and visual quality matter too

---

## ✨ Bonus Ideas (mid-senior levels)

- Add **search**, **filter**, or **pagination** to the Market list  
- Animate the portfolio when pricings change (e.g. market open effect)  
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

## 🧾 Internal Use

- [Review focus](https://hello-stake.atlassian.net/wiki/spaces/DEV/pages/2172747777/Code+Review+Focus+internal+use+only)
- Export as PDF to fill out [Assessment notes](https://hello-stake.atlassian.net/wiki/spaces/DEV/pages/2172452872/Reviewer+Notes+-+Front-End+Assessment)
