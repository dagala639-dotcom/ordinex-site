"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type BusinessType =
  | ""
  | "restaurant"
  | "cafe"
  | "bar"
  | "club"
  | "hotel"
  | "fuel";

export default function HomePage() {
  const [businessType, setBusinessType] = useState<BusinessType>("");
  const [tabletCount, setTabletCount] = useState(2);
  const [needsKitchenDisplay, setNeedsKitchenDisplay] = useState(false);

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showKitchenOption =
    businessType === "restaurant" ||
    businessType === "cafe" ||
    businessType === "bar" ||
    businessType === "club" ||
    businessType === "hotel";

  const estimate = useMemo(() => {
    const cashierCost = 25000;
    const tabletCost = tabletCount * 15000;
    const kitchenCost = showKitchenOption && needsKitchenDisplay ? 20000 : 0;
    const installationCost = 20000;

    return {
      cashierCost,
      tabletCost,
      kitchenCost,
      installationCost,
      total: cashierCost + tabletCost + kitchenCost + installationCost,
    };
  }, [tabletCount, needsKitchenDisplay, showKitchenOption]);

  function getBusinessLabel(type: BusinessType) {
    switch (type) {
      case "restaurant":
        return "Restaurant";
      case "cafe":
        return "Café";
      case "bar":
        return "Bar";
      case "club":
        return "Lounge / Club";
      case "hotel":
        return "Hotel / Hospitality";
      case "fuel":
        return "Fuel Station";
      default:
        return "Business";
    }
  }

  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleDemoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const businessName = String(formData.get("businessName") || "");
    const businessTypeValue = String(formData.get("businessType") || "");
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const location = String(formData.get("location") || "");

    const subject = encodeURIComponent("Ordinex Demo Request");
    const body = encodeURIComponent(
      `Hello,

I would like to request a demo for Ordinex.

Business Name: ${businessName}
Business Type: ${businessTypeValue}
Full Name: ${fullName}
Phone Number: ${phone}
Email Address: ${email}
Location: ${location}
`
    );

    window.location.href = `mailto:hello@ordinex.co?subject=${subject}&body=${body}`;
  }

  function increaseTablets() {
    setTabletCount((prev) => Math.min(prev + 1, 20));
  }

  function decreaseTablets() {
    setTabletCount((prev) => Math.max(prev - 1, 1));
  }

  function handleTabletInputChange(value: string) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    if (numeric < 1) {
      setTabletCount(1);
      return;
    }
    if (numeric > 20) {
      setTabletCount(20);
      return;
    }
    setTabletCount(numeric);
  }

  function handleSendRealQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent("Ordinex Real Quote Request");
    const body = encodeURIComponent(
      `Hello,

I would like a real quote for Ordinex.

Client Name: ${quoteName}
Client Email: ${quoteEmail}
Client Phone: ${quotePhone}

Business Type: ${getBusinessLabel(businessType)}
Number of Staff Tablets: ${tabletCount}
Kitchen Display: ${
        showKitchenOption ? (needsKitchenDisplay ? "Yes" : "No") : "Not applicable"
      }

Estimated Breakdown:
Cashier POS: KES ${estimate.cashierCost.toLocaleString()}
Staff Tablets: KES ${estimate.tabletCost.toLocaleString()}
Kitchen Display: KES ${estimate.kitchenCost.toLocaleString()}
Installation: KES ${estimate.installationCost.toLocaleString()}

Estimated Total: KES ${estimate.total.toLocaleString()}
`
    );

    window.location.href = `mailto:hello@ordinex.co?subject=${subject}&body=${body}`;
  }

  return (
    <main style={styles.page}>
      {showQuoteForm ? (
        <div style={styles.modalOverlay} onClick={() => setShowQuoteForm(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalBadge}>Get Real Quote</div>
            <h3 style={styles.modalTitle}>Send your package to Ordinex</h3>
            <p style={styles.modalText}>
              Add your details and your selected setup will be prepared in an
              email draft to our team.
            </p>

            <form style={styles.modalForm} onSubmit={handleSendRealQuote}>
              <input
                style={styles.modalInput}
                placeholder="Full Name"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                required
              />
              <input
                style={styles.modalInput}
                placeholder="Email Address"
                type="email"
                value={quoteEmail}
                onChange={(e) => setQuoteEmail(e.target.value)}
                required
              />
              <input
                style={styles.modalInput}
                placeholder="Phone Number"
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                required
              />

              <div style={styles.modalActions}>
                <button type="submit" style={styles.modalPrimaryButton}>
                  Send Quote Request
                </button>
                <button
                  type="button"
                  style={styles.modalSecondaryButton}
                  onClick={() => setShowQuoteForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <section style={styles.hero}>
        <video autoPlay muted loop playsInline style={styles.heroVideo}>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div style={styles.heroOverlay} />
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />
        <div style={styles.heroGrid} />

        <nav
          style={{
            ...styles.nav,
            ...(isMobile ? styles.navMobile : {}),
          }}
        >
          <div style={styles.brandWrap}>
            <Image
              src="/logo/ordinex-logo.jpeg"
              alt="Ordinex logo"
              width={168}
              height={56}
              style={styles.logoImage}
              priority
            />
          </div>

          {!isMobile ? (
            <div style={styles.navLinks}>
              <a href="#solutions" style={styles.navLink}>
                Solutions
              </a>
              <a href="#showcase" style={styles.navLink}>
                Product
              </a>
              <a href="#features" style={styles.navLink}>
                Features
              </a>
              <a href="#calculator" style={styles.navLink}>
                Pricing
              </a>
              <a href="#contact" style={styles.navLink}>
                Contact
              </a>
            </div>
          ) : null}

          <button
            style={{
              ...styles.navButton,
              ...(isMobile ? styles.navButtonMobile : {}),
            }}
            onClick={() => scrollToSection("contact")}
          >
            Request Demo
          </button>
        </nav>

        <div
          style={{
            ...styles.heroInner,
            ...(isMobile ? styles.heroInnerMobile : {}),
          }}
        >
          <div style={styles.heroCopy}>
            <div style={styles.heroPill}>Hospitality & Fuel Operations Platform</div>

            <h1
              style={{
                ...styles.heroTitle,
                ...(isMobile ? styles.heroTitleMobile : {}),
              }}
            >
              Premium POS and operations software for fast-moving businesses.
            </h1>

            <p style={styles.heroText}>
              Ordinex connects waiter tablets, kitchen display, cashier control,
              fuel attendant devices, reporting, and owner visibility in one
              modern operating system.
            </p>

            <div style={styles.heroActions}>
              <button
                style={styles.heroPrimaryButton}
                onClick={() => scrollToSection("calculator")}
              >
                Estimate Your Setup
              </button>

              <button
                style={styles.heroSecondaryButton}
                onClick={() => scrollToSection("showcase")}
              >
                View Product
              </button>
            </div>

            <div
              style={{
                ...styles.heroStats,
                ...(isMobile ? styles.heroStatsMobile : {}),
              }}
            >
              <div style={styles.heroStatCard}>
                <div style={styles.heroStatNumber}>Waiter</div>
                <div style={styles.heroStatText}>Tablet-ready front-of-house flow</div>
              </div>
              <div style={styles.heroStatCard}>
                <div style={styles.heroStatNumber}>Cashier</div>
                <div style={styles.heroStatText}>Billing, payments, and shift control</div>
              </div>
              <div style={styles.heroStatCard}>
                <div style={styles.heroStatNumber}>Fuel</div>
                <div style={styles.heroStatText}>
                  Attendant sales capture and shift visibility
                </div>
              </div>
            </div>
          </div>

          <div style={styles.heroFormShell}>
            <div style={styles.heroFormCard}>
              <div style={styles.heroFormHeader}>
                <p style={styles.formLabel}>Request a demo</p>
                <h3 style={styles.formTitle}>See Ordinex in action</h3>
                <p style={styles.formText}>
                  Tell us about your business and we’ll prepare the right setup
                  direction for you.
                </p>
              </div>

              <form style={styles.form} onSubmit={handleDemoSubmit}>
                <input
                  name="businessName"
                  placeholder="Business Name"
                  style={styles.input}
                  required
                />
                <select name="businessType" style={styles.input} required defaultValue="">
                  <option value="" disabled>
                    Business Type
                  </option>
                  <option>Restaurant</option>
                  <option>Bar</option>
                  <option>Lounge / Club</option>
                  <option>Café</option>
                  <option>Fuel Station</option>
                  <option>Hotel / Hospitality</option>
                  <option>Other</option>
                </select>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  style={styles.input}
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  style={styles.input}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  style={styles.input}
                  required
                />
                <input
                  name="location"
                  placeholder="Location"
                  style={styles.input}
                  required
                />

                <button type="submit" style={styles.formSubmitButton}>
                  Request a Demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="showcase">
        <div style={styles.sectionInnerWide}>
          <div
            style={{
              ...styles.sectionHeader,
              ...(isMobile ? styles.sectionHeaderMobile : {}),
            }}
          >
            <div>
              <div style={styles.sectionEyebrow}>Product Showcase</div>
              <h2 style={styles.sectionTitle}>See Ordinex in action</h2>
            </div>
            <p style={styles.sectionCopy}>
              Real screens from Ordinex showing live waiter operations, cashier
              control, owner visibility, manager workflow, and fuel station
              operations in a clean premium system.
            </p>
          </div>

          <div style={styles.productStack}>
            <div style={styles.productPanelLarge}>
              <div style={styles.productPanelTop}>
                <div>
                  <div style={styles.productPanelTag}>Waiter Console</div>
                  <h3 style={styles.productPanelTitle}>
                    Live table control and floor operations
                  </h3>
                  <p style={styles.productPanelText}>
                    Waiters see available tables, locked tables, their own open
                    bills, and service flow from one clean interface designed
                    for speed.
                  </p>
                </div>
              </div>

              <div style={styles.productImageFrame}>
                <Image
                  src="/images/waiter-screen.png"
                  alt="Ordinex waiter interface"
                  width={1600}
                  height={900}
                  style={styles.productImage}
                />
              </div>
            </div>

            <div style={styles.productPanelLarge}>
              <div style={styles.productPanelTop}>
                <div>
                  <div style={styles.productPanelTag}>Cashier Console</div>
                  <h3 style={styles.productPanelTitle}>
                    Billing, payment, and shift visibility
                  </h3>
                  <p style={styles.productPanelText}>
                    Cashiers monitor bills, unpaid totals, payment breakdowns,
                    and daily figures from a powerful operational control screen.
                  </p>
                </div>
              </div>

              <div style={styles.productImageFrame}>
                <Image
                  src="/images/cashier-screen.png"
                  alt="Ordinex cashier interface"
                  width={1600}
                  height={900}
                  style={styles.productImage}
                />
              </div>
            </div>

            <div style={styles.productPanelLarge}>
              <div style={styles.productPanelTop}>
                <div>
                  <div style={styles.productPanelTag}>Fuel Attendant Screen</div>
                  <h3 style={styles.productPanelTitle}>
                    Fast fuel sales capture with live shift visibility
                  </h3>
                  <p style={styles.productPanelText}>
                    Attendants enter the amount paid and Ordinex automatically
                    calculates litres sold, tracks payment method, and shows cash
                    expected in hand for smooth shift control.
                  </p>
                </div>
              </div>

              <div style={styles.productImageFrame}>
                <Image
                  src="/images/fuelAttendant-screen.png"
                  alt="Ordinex fuel attendant screen"
                  width={1600}
                  height={900}
                  style={styles.productImage}
                />
              </div>
            </div>

            <div
              style={{
                ...styles.dashboardShowcaseGrid,
                ...(isMobile ? styles.dashboardShowcaseGridMobile : {}),
              }}
            >
              <div style={styles.productPanelMedium}>
                <div style={styles.productPanelTop}>
                  <div>
                    <div style={styles.productPanelTag}>Owner Dashboard</div>
                    <h3 style={styles.productPanelSmallTitle}>
                      Executive visibility for owners
                    </h3>
                    <p style={styles.productPanelSmallText}>
                      View hotel account exposure, top-selling items, cost
                      breakdown, and high-level business performance from one
                      premium summary screen.
                    </p>
                  </div>
                </div>

                <div style={styles.productImageFrame}>
                  <Image
                    src="/images/owner-dashboard.png"
                    alt="Ordinex owner dashboard"
                    width={1600}
                    height={900}
                    style={styles.productImage}
                  />
                </div>
              </div>

              <div style={styles.productPanelMedium}>
                <div style={styles.productPanelTop}>
                  <div>
                    <div style={styles.productPanelTag}>Manager Console</div>
                    <h3 style={styles.productPanelSmallTitle}>
                      Daily operational control
                    </h3>
                    <p style={styles.productPanelSmallText}>
                      Managers track sales, expenses, labor, pending bills, and
                      stock activity from a central operational console built for
                      fast moving businesses.
                    </p>
                  </div>
                </div>

                <div style={styles.productImageFrame}>
                  <Image
                    src="/images/manager-dashboard.png"
                    alt="Ordinex manager dashboard"
                    width={1600}
                    height={900}
                    style={styles.productImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="solutions">
        <div style={styles.sectionInner}>
          <div
            style={{
              ...styles.sectionHeader,
              ...(isMobile ? styles.sectionHeaderMobile : {}),
            }}
          >
            <div>
              <div style={styles.sectionEyebrow}>Solutions</div>
              <h2 style={styles.sectionTitle}>Structured for real business models</h2>
            </div>
            <p style={styles.sectionCopy}>
              Ordinex is designed around the real workflows of restaurants,
              bars, hospitality businesses, and fuel stations.
            </p>
          </div>

          <div
            style={{
              ...styles.solutionGrid,
              ...(isMobile ? styles.solutionGridMobile : {}),
            }}
          >
            <div style={styles.solutionCard}>
              <div style={styles.solutionBadge}>Restaurants & Cafés</div>
              <h3
                style={{
                  ...styles.solutionTitle,
                  ...(isMobile ? styles.solutionTitleMobile : {}),
                }}
              >
                Waiter to kitchen to cashier
              </h3>
              <p style={styles.solutionText}>
                Give waiters their own tablets, move orders to the kitchen
                instantly, and keep payment confirmation under cashier control.
              </p>
            </div>

            <div style={styles.solutionCard}>
              <div style={styles.solutionBadge}>Bars & Lounges</div>
              <h3
                style={{
                  ...styles.solutionTitle,
                  ...(isMobile ? styles.solutionTitleMobile : {}),
                }}
              >
                Tabs, VIP tables, and night control
              </h3>
              <p style={styles.solutionText}>
                Manage open tabs, repeated drink orders, fast service, and
                cashier-controlled payment flow during high-volume nights.
              </p>
            </div>

            <div style={styles.solutionCard}>
              <div style={styles.solutionBadge}>Hotels & Hospitality</div>
              <h3
                style={{
                  ...styles.solutionTitle,
                  ...(isMobile ? styles.solutionTitleMobile : {}),
                }}
              >
                Connected service operations
              </h3>
              <p style={styles.solutionText}>
                Coordinate service points, staff workflows, and reporting
                visibility in one connected operational environment.
              </p>
            </div>

            <div style={styles.solutionCard}>
              <div style={styles.solutionBadge}>Fuel Stations</div>
              <h3
                style={{
                  ...styles.solutionTitle,
                  ...(isMobile ? styles.solutionTitleMobile : {}),
                }}
              >
                Attendant to manager flow
              </h3>
              <p style={styles.solutionText}>
                Fuel attendants use their own tablet to record sales, calculate
                litres automatically, monitor cash expected in hand, and give
                managers clear shift-level visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="features">
        <div style={styles.sectionInner}>
          <div
            style={{
              ...styles.sectionHeader,
              ...(isMobile ? styles.sectionHeaderMobile : {}),
            }}
          >
            <div>
              <div style={styles.sectionEyebrow}>Features</div>
              <h2 style={styles.sectionTitle}>A commercial-grade operations stack</h2>
            </div>
            <p style={styles.sectionCopy}>
              Everything from service flow and payments to permissions, reports,
              and offline continuity.
            </p>
          </div>

          <div
            style={{
              ...styles.featureColumns,
              ...(isMobile ? styles.featureColumnsMobile : {}),
            }}
          >
            <div style={styles.featureColumn}>
              <div style={styles.featureGroupTitle}>Operations</div>
              <div style={styles.featureItem}>Multi-terminal system</div>
              <div style={styles.featureItem}>Waiter / attendant devices</div>
              <div style={styles.featureItem}>Kitchen display system</div>
              <div style={styles.featureItem}>Cashier POS control</div>
              <div style={styles.featureItem}>Shift and workflow management</div>
            </div>

            <div style={styles.featureColumn}>
              <div style={styles.featureGroupTitle}>Payments</div>
              <div style={styles.featureItem}>M-Pesa integration ready</div>
              <div style={styles.featureItem}>Cash and card flow support</div>
              <div style={styles.featureItem}>Drawer and cashier tracking</div>
              <div style={styles.featureItem}>Receipt-based billing flow</div>
              <div style={styles.featureItem}>End-of-shift visibility</div>
            </div>

            <div style={styles.featureColumn}>
              <div style={styles.featureGroupTitle}>Control & Insight</div>
              <div style={styles.featureItem}>Roles and permissions</div>
              <div style={styles.featureItem}>Analytics and reports</div>
              <div style={styles.featureItem}>Offline capability</div>
              <div style={styles.featureItem}>Cloud/local expansion ready</div>
              <div style={styles.featureItem}>Owner dashboard direction</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div
            style={{
              ...styles.workflowBand,
              ...(isMobile ? styles.workflowBandMobile : {}),
            }}
          >
            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>01</div>
              <div style={styles.workflowStepTitle}>Capture activity</div>
              <div style={styles.workflowStepText}>
                Staff use role-based devices to log orders, bills, or fuel sales.
              </div>
            </div>

            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>02</div>
              <div style={styles.workflowStepTitle}>Route to the right point</div>
              <div style={styles.workflowStepText}>
                Orders and actions move to kitchen, cashier, or management flow.
              </div>
            </div>

            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>03</div>
              <div style={styles.workflowStepTitle}>Control payments</div>
              <div style={styles.workflowStepText}>
                Cashiers confirm payments and keep clear financial visibility.
              </div>
            </div>

            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>04</div>
              <div style={styles.workflowStepTitle}>See performance</div>
              <div style={styles.workflowStepText}>
                Managers and owners get reporting, insight, and stronger control.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="calculator">
        <div style={styles.sectionInner}>
          <div
            style={{
              ...styles.sectionHeader,
              ...(isMobile ? styles.sectionHeaderMobile : {}),
            }}
          >
            <div>
              <div style={styles.sectionEyebrow}>Pricing Estimator</div>
              <h2 style={styles.sectionTitle}>Build your Ordinex package</h2>
            </div>
            <p style={styles.sectionCopy}>
              Cashier POS and tablets are always part of the setup. Add kitchen
              display where needed.
            </p>
          </div>

          <div
            style={{
              ...styles.configurator,
              ...(isMobile ? styles.configuratorMobile : {}),
            }}
          >
            <div style={styles.configuratorLeft}>
              <div style={styles.configCard}>
                <label style={styles.configLabel}>Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => {
                    const value = e.target.value as BusinessType;
                    setBusinessType(value);
                    if (value === "fuel") setNeedsKitchenDisplay(false);
                  }}
                  style={styles.configInput}
                >
                  <option value="">Choose business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="bar">Bar</option>
                  <option value="club">Lounge / Club</option>
                  <option value="hotel">Hotel / Hospitality</option>
                  <option value="fuel">Fuel Station</option>
                </select>

                <label style={styles.configLabel}>Number of Staff Tablets</label>
                <div style={styles.numberControl}>
                  <button type="button" style={styles.numberButton} onClick={decreaseTablets}>
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tabletCount}
                    onChange={(e) => handleTabletInputChange(e.target.value)}
                    style={styles.numberInput}
                  />
                  <button type="button" style={styles.numberButton} onClick={increaseTablets}>
                    +
                  </button>
                </div>

                {showKitchenOption ? (
                  <>
                    <label style={styles.configLabel}>Kitchen Display</label>
                    <div style={styles.toggleRow}>
                      <button
                        type="button"
                        style={{
                          ...styles.toggleButton,
                          ...(needsKitchenDisplay ? styles.toggleButtonActive : {}),
                        }}
                        onClick={() => setNeedsKitchenDisplay(true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        style={{
                          ...styles.toggleButton,
                          ...(!needsKitchenDisplay ? styles.toggleButtonActive : {}),
                        }}
                        onClick={() => setNeedsKitchenDisplay(false)}
                      >
                        No
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div style={styles.configuratorRight}>
              <div style={styles.quoteCard}>
                <div style={styles.quoteTopLabel}>Estimated Package</div>
                <h3 style={styles.quoteTitle}>
                  {businessType ? getBusinessLabel(businessType) : "Your Business"}
                </h3>

                <div style={styles.quoteRow}>
                  <span>Cashier POS</span>
                  <strong>KES {estimate.cashierCost.toLocaleString()}</strong>
                </div>
                <div style={styles.quoteRow}>
                  <span>Staff Tablets ({tabletCount})</span>
                  <strong>KES {estimate.tabletCost.toLocaleString()}</strong>
                </div>
                {showKitchenOption ? (
                  <div style={styles.quoteRow}>
                    <span>Kitchen Display</span>
                    <strong>KES {estimate.kitchenCost.toLocaleString()}</strong>
                  </div>
                ) : null}
                <div style={styles.quoteRow}>
                  <span>Installation</span>
                  <strong>KES {estimate.installationCost.toLocaleString()}</strong>
                </div>

                <div style={styles.quoteTotalBox}>
                  <div style={styles.quoteTotalLabel}>Estimated Total</div>
                  <div style={styles.quoteTotalValue}>
                    KES {estimate.total.toLocaleString()}
                  </div>
                </div>

                <div style={styles.quoteActions}>
                  <button
                    type="button"
                    style={styles.quotePrimaryButton}
                    onClick={() => setShowQuoteForm(true)}
                  >
                    Get Real Quote
                  </button>
                  <button
                    type="button"
                    style={styles.quoteSecondaryButton}
                    onClick={() => scrollToSection("contact")}
                  >
                    Talk to Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="contact">
        <div style={styles.sectionInner}>
          <div style={styles.contactShell}>
            <div style={styles.contactBadge}>Contact</div>
            <h2 style={styles.contactTitle}>Ready to talk about Ordinex?</h2>
            <p style={styles.contactText}>
              Reach out for demos, pricing, setup planning, or installation
              discussions.
            </p>

            <div style={styles.contactButtons}>
              <a href="mailto:hello@ordinex.co" style={styles.contactPrimaryButton}>
                Email Us
              </a>
              <a href="tel:0769753581" style={styles.contactSecondaryButton}>
                Call Us
              </a>
              <a
                href="https://wa.me/254769753581"
                style={styles.contactSecondaryButton}
              >
                WhatsApp Us
              </a>
            </div>

            <div style={styles.contactMeta}>
              <div style={styles.contactMetaChip}>Phone: 0769753581</div>
              <div style={styles.contactMetaChip}>WhatsApp: 0769753581</div>
              <div style={styles.contactMetaChip}>Email: hello@ordinex.co</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    margin: 0,
    background: "#040816",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  hero: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#040816",
  },
  heroVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(4,8,22,0.70) 0%, rgba(4,8,22,0.88) 55%, rgba(4,8,22,0.98) 100%)",
  },
  heroGlowOne: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "rgba(61, 112, 255, 0.18)",
    filter: "blur(120px)",
    top: -120,
    left: -100,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "rgba(17, 72, 255, 0.14)",
    filter: "blur(110px)",
    bottom: -120,
    right: -80,
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    pointerEvents: "none",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)",
  },

  nav: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1280,
    margin: "0 auto",
    padding: "22px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  navMobile: {
    padding: "18px 16px",
    gap: 12,
    alignItems: "center",
  },
  brandWrap: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: "auto",
    height: "46px",
    objectFit: "contain",
    borderRadius: "10px",
  },
  navLinks: {
    display: "flex",
    gap: 22,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  navLink: {
    color: "rgba(255,255,255,0.82)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
  navButton: {
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    border: "1px solid rgba(114, 145, 255, 0.35)",
    boxShadow: "0 0 24px rgba(68, 102, 255, 0.26)",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  navButtonMobile: {
    width: "100%",
  },

  heroInner: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1280,
    margin: "0 auto",
    minHeight: "calc(100vh - 90px)",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.78fr",
    gap: 28,
    alignItems: "center",
    padding: "24px 20px 70px",
  },
  heroInnerMobile: {
    gridTemplateColumns: "1fr",
    padding: "18px 16px 50px",
    gap: 24,
  },
  heroCopy: {
    maxWidth: 720,
  },
  heroPill: {
    display: "inline-block",
    padding: "9px 15px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.14)",
    border: "1px solid rgba(114,145,255,0.24)",
    color: "#9fb8ff",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 18,
  },
  heroTitle: {
    margin: "0 0 14px 0",
    fontSize: "clamp(36px, 7vw, 72px)",
    lineHeight: 1.02,
    letterSpacing: -2,
    fontWeight: 800,
    color: "#ffffff",
    maxWidth: 820,
  },
  heroTitleMobile: {
    fontSize: "42px",
    lineHeight: 1.03,
    letterSpacing: -1.5,
  },
  heroText: {
    margin: 0,
    color: "rgba(255,255,255,0.76)",
    fontSize: "clamp(16px, 2.3vw, 19px)",
    lineHeight: 1.8,
    maxWidth: 680,
  },
  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 28,
  },
  heroPrimaryButton: {
    padding: "15px 20px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(68, 102, 255, 0.26)",
    minWidth: "190px",
  },
  heroSecondaryButton: {
    padding: "15px 20px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    minWidth: "170px",
  },
  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  heroStatsMobile: {
    gridTemplateColumns: "1fr",
  },
  heroStatCard: {
    background: "rgba(11, 18, 42, 0.72)",
    border: "1px solid rgba(95, 126, 255, 0.14)",
    borderRadius: 20,
    padding: 18,
    backdropFilter: "blur(12px)",
  },
  heroStatNumber: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 8,
  },
  heroStatText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 1.6,
  },

  heroFormShell: {
    display: "flex",
    justifyContent: "center",
  },
  heroFormCard: {
    width: "100%",
    maxWidth: 430,
    background: "rgba(9, 16, 38, 0.76)",
    border: "1px solid rgba(96, 125, 255, 0.18)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 0 30px rgba(42, 78, 220, 0.12)",
    backdropFilter: "blur(18px)",
  },
  heroFormHeader: {
    marginBottom: 18,
  },
  formLabel: {
    margin: 0,
    color: "#8fb1ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  formTitle: {
    margin: "10px 0 8px 0",
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#ffffff",
  },
  formText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 1.7,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(113, 144, 255, 0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },
  formSubmitButton: {
    marginTop: 4,
    padding: "15px 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(68, 102, 255, 0.24)",
  },

  section: {
    background: "#040816",
    padding: "92px 16px",
  },
  sectionInner: {
    maxWidth: 1220,
    margin: "0 auto",
  },
  sectionInnerWide: {
    maxWidth: 1320,
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "end",
    flexWrap: "wrap",
    marginBottom: 28,
  },
  sectionHeaderMobile: {
    alignItems: "start",
    gap: 14,
  },
  sectionEyebrow: {
    color: "#8fb1ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "clamp(28px, 4.6vw, 48px)",
    lineHeight: 1.08,
    letterSpacing: -1,
    fontWeight: 800,
    color: "#ffffff",
    maxWidth: 740,
  },
  sectionCopy: {
    margin: 0,
    maxWidth: 460,
    color: "rgba(255,255,255,0.70)",
    fontSize: 16,
    lineHeight: 1.8,
  },

  productStack: {
    display: "grid",
    gap: 24,
  },
  productPanelLarge: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 30,
    padding: 26,
    boxShadow: "0 0 32px rgba(40, 72, 210, 0.08)",
  },
  productPanelMedium: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 28,
    padding: 22,
    boxShadow: "0 0 28px rgba(40, 72, 210, 0.08)",
  },
  dashboardShowcaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 24,
  },
  dashboardShowcaseGridMobile: {
    gridTemplateColumns: "1fr",
  },
  productPanelTop: {
    marginBottom: 18,
  },
  productPanelTag: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.14)",
    border: "1px solid rgba(114,145,255,0.18)",
    color: "#a7c0ff",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  productPanelTitle: {
    margin: "0 0 10px 0",
    fontSize: "clamp(24px, 4vw, 36px)",
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#ffffff",
  },
  productPanelSmallTitle: {
    margin: "0 0 10px 0",
    fontSize: "clamp(22px, 3.2vw, 30px)",
    lineHeight: 1.12,
    fontWeight: 800,
    color: "#ffffff",
  },
  productPanelText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 820,
  },
  productPanelSmallText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 1.75,
    maxWidth: 720,
  },
  productImageFrame: {
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(96, 126, 255, 0.16)",
    background: "rgba(255,255,255,0.02)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
  },
  productImage: {
    width: "100%",
    height: "auto",
    display: "block",
  },

  solutionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },
  solutionGridMobile: {
    gridTemplateColumns: "1fr",
  },
  solutionCard: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 0 24px rgba(40, 72, 210, 0.08)",
  },
  solutionBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.14)",
    border: "1px solid rgba(114,145,255,0.18)",
    color: "#a7c0ff",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 14,
  },
  solutionTitle: {
    margin: "0 0 10px 0",
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 1.12,
    fontWeight: 800,
  },
  solutionTitleMobile: {
    fontSize: 34,
    lineHeight: 1.04,
    letterSpacing: -1,
  },
  solutionText: {
    margin: 0,
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
    lineHeight: 1.8,
  },

  featureColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },
  featureColumnsMobile: {
    gridTemplateColumns: "1fr",
  },
  featureColumn: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 24,
    padding: 24,
  },
  featureGroupTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 16,
  },
  featureItem: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 15,
    lineHeight: 1.7,
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  workflowBand: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 18,
  },
  workflowBandMobile: {
    gridTemplateColumns: "1fr",
  },
  workflowStep: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 24,
    padding: 22,
  },
  workflowNumber: {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 16,
    marginBottom: 16,
    boxShadow: "0 0 18px rgba(68, 102, 255, 0.24)",
  },
  workflowStepTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 10,
  },
  workflowStepText: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
    lineHeight: 1.75,
  },

  configurator: {
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    gap: 22,
    alignItems: "start",
  },
  configuratorMobile: {
    gridTemplateColumns: "1fr",
  },
  configuratorLeft: {},
  configuratorRight: {},
  configCard: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 28,
    padding: 24,
  },
  configLabel: {
    display: "block",
    color: "#dfe8ff",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    marginTop: 16,
  },
  configInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(113, 144, 255, 0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },
  numberControl: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  numberButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    border: "1px solid rgba(113, 144, 255, 0.16)",
    background: "rgba(49,90,255,0.14)",
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 800,
    cursor: "pointer",
    flexShrink: 0,
  },
  numberInput: {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(113, 144, 255, 0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 16,
    outline: "none",
    textAlign: "center",
  },
  toggleRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 6,
  },
  toggleButton: {
    flex: 1,
    minWidth: "130px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  toggleButtonActive: {
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    border: "1px solid rgba(114, 145, 255, 0.28)",
    boxShadow: "0 0 18px rgba(68, 102, 255, 0.22)",
  },

  quoteCard: {
    background: "linear-gradient(180deg, rgba(12,22,54,0.98), rgba(8,14,33,0.98))",
    border: "1px solid rgba(98, 129, 255, 0.18)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 0 30px rgba(48, 82, 214, 0.10)",
  },
  quoteTopLabel: {
    color: "#8fb1ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  quoteTitle: {
    margin: "0 0 16px 0",
    color: "#ffffff",
    fontSize: 30,
    fontWeight: 800,
  },
  quoteRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
  },
  quoteTotalBox: {
    marginTop: 18,
    marginBottom: 18,
    borderRadius: 22,
    padding: 20,
    background: "linear-gradient(135deg, rgba(37,81,255,0.24), rgba(92,125,255,0.18))",
    border: "1px solid rgba(114,145,255,0.18)",
  },
  quoteTotalLabel: {
    color: "#a9c0ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  quoteTotalValue: {
    color: "#ffffff",
    fontSize: "clamp(30px, 5vw, 42px)",
    lineHeight: 1.05,
    fontWeight: 800,
  },
  quoteActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  quotePrimaryButton: {
    flex: 1,
    minWidth: "180px",
    padding: "15px 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  quoteSecondaryButton: {
    flex: 1,
    minWidth: "160px",
    padding: "15px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },

  contactShell: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    borderRadius: 32,
    padding: 34,
    textAlign: "center",
    boxShadow: "0 0 34px rgba(40,72,210,0.08)",
  },
  contactBadge: {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.14)",
    border: "1px solid rgba(114,145,255,0.18)",
    color: "#9fb8ff",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 18,
  },
  contactTitle: {
    margin: "0 0 10px 0",
    color: "#ffffff",
    fontSize: "clamp(30px, 5vw, 52px)",
    lineHeight: 1.08,
    letterSpacing: -1,
    fontWeight: 800,
  },
  contactText: {
    margin: "0 auto",
    maxWidth: 720,
    color: "rgba(255,255,255,0.72)",
    fontSize: 17,
    lineHeight: 1.8,
  },
  contactButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 26,
    marginBottom: 22,
  },
  contactPrimaryButton: {
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    padding: "15px 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 15,
    minWidth: "160px",
  },
  contactSecondaryButton: {
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    padding: "15px 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 15,
    border: "1px solid rgba(255,255,255,0.12)",
    minWidth: "160px",
  },
  contactMeta: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  contactMetaChip: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.15)",
    color: "#b8d0ff",
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid rgba(89,128,255,0.18)",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2, 6, 23, 0.76)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 26,
    padding: 24,
    background: "linear-gradient(180deg, rgba(10,17,40,0.98), rgba(7,13,30,0.98))",
    border: "1px solid rgba(92, 123, 255, 0.16)",
    boxShadow: "0 0 32px rgba(40,72,210,0.14)",
  },
  modalBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.14)",
    border: "1px solid rgba(114,145,255,0.18)",
    color: "#9fb8ff",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  modalTitle: {
    margin: "0 0 10px 0",
    fontSize: 30,
    lineHeight: 1.12,
    fontWeight: 800,
    color: "#ffffff",
  },
  modalText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 1.75,
  },
  modalForm: {
    display: "grid",
    gap: 12,
    marginTop: 22,
  },
  modalInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(113, 144, 255, 0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },
  modalActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 6,
  },
  modalPrimaryButton: {
    flex: 1,
    minWidth: "180px",
    padding: "15px 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2551ff, #5c7dff)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  modalSecondaryButton: {
    flex: 1,
    minWidth: "160px",
    padding: "15px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};