"use client";

import React, { useMemo, useState } from "react";
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

  function handleDemoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

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

  function handleContinueHome() {
    const section = document.getElementById("industries");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

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

    const total = cashierCost + tabletCost + kitchenCost + installationCost;

    return {
      cashierCost,
      tabletCost,
      kitchenCost,
      installationCost,
      total,
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

  function openQuoteForm() {
    setShowQuoteForm(true);
  }

  function closeQuoteForm() {
    setShowQuoteForm(false);
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

  return (
    <main style={styles.page}>
      {showQuoteForm ? (
        <div style={styles.modalOverlay} onClick={closeQuoteForm}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <p style={styles.modalLabel}>Get Real Quote</p>
            <h3 style={styles.modalTitle}>Send Your Estimate to Our Email</h3>
            <p style={styles.modalText}>
              Enter your details and your selected Ordinex package will be
              prepared in an email draft addressed to us.
            </p>

            <form style={styles.modalForm} onSubmit={handleSendRealQuote}>
              <input
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                placeholder="Full Name"
                style={styles.modalInput}
                required
              />

              <input
                value={quoteEmail}
                onChange={(e) => setQuoteEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                style={styles.modalInput}
                required
              />

              <input
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                placeholder="Phone Number"
                style={styles.modalInput}
                required
              />

              <div style={styles.modalButtons}>
                <button type="submit" style={styles.modalPrimaryButton}>
                  Send Quote Request
                </button>

                <button
                  type="button"
                  style={styles.modalSecondaryButton}
                  onClick={closeQuoteForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <section style={styles.hero}>
        <video autoPlay muted loop playsInline style={styles.video}>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div style={styles.overlay} />

        <nav style={styles.nav}>
          <div style={styles.logoWrap}>
            <Image
              src="/logo/ordinex-logo.jpeg"
              alt="Ordinex logo"
              width={170}
              height={58}
              style={styles.logoImage}
              priority
            />
          </div>

          <div style={styles.navLinks}>
            <a href="#industries" style={styles.navLink}>
              Industries
            </a>
            <a href="#showcase" style={styles.navLink}>
              Screenshots
            </a>
            <a href="#solutions" style={styles.navLink}>
              Solutions
            </a>
            <a href="#features" style={styles.navLink}>
              Features
            </a>
            <a href="#how" style={styles.navLink}>
              How It Works
            </a>
            <a href="#calculator" style={styles.navLink}>
              Calculator
            </a>
            <a href="#contact" style={styles.navLink}>
              Contact
            </a>
          </div>

          <button type="button" style={styles.navButton} onClick={handleContinueHome}>
            Continue to Home
          </button>
        </nav>

        <div style={styles.heroContent}>
          <div style={styles.formCard}>
            <div style={styles.badge}>Hospitality & Fuel Operations Platform</div>

            <h1 style={styles.title}>
              Modern POS and Operations Software for Restaurants, Bars, Hotels,
              and Fuel Stations
            </h1>

            <p style={styles.subtitle}>
              Ordinex connects staff devices, cashier control, preparation
              workflows, reporting, and owner visibility in one modern system
              built for fast-moving businesses.
            </p>

            <div style={styles.points}>
              <div style={styles.point}>Faster service workflows</div>
              <div style={styles.point}>Better staff coordination</div>
              <div style={styles.point}>Real-time operational visibility</div>
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

              <div style={styles.buttonRow}>
                <button type="submit" style={styles.submitButton}>
                  Request a Demo
                </button>

                <button
                  type="button"
                  style={styles.secondaryButtonHero}
                  onClick={handleContinueHome}
                >
                  Continue to Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="industries" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabelBlue}>Industries We Serve</p>
          <h2 style={styles.sectionTitleLight}>
            Built for Fast-Moving Hospitality and Service Operations
          </h2>
          <p style={styles.sectionTextLight}>
            Ordinex is built for businesses that need speed, control, accurate
            billing, and connected staff workflows across multiple service
            points.
          </p>

          <div style={styles.gridDark}>
            <div style={styles.cardDark}>Restaurants</div>
            <div style={styles.cardDark}>Bars</div>
            <div style={styles.cardDark}>Lounges & Clubs</div>
            <div style={styles.cardDark}>Cafés</div>
            <div style={styles.cardDark}>Hotels</div>
            <div style={styles.cardDark}>Fuel Stations</div>
          </div>
        </div>
      </section>

      <section id="showcase" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabelBlue}>See Ordinex in Action</p>
          <h2 style={styles.sectionTitleLight}>
            Real Screens from the Ordinex System
          </h2>
          <p style={styles.sectionTextLight}>
            These screenshots show how Ordinex already handles live waiter
            operations and cashier payment control.
          </p>

          <div style={styles.showcaseGrid}>
            <div style={styles.showcaseCard}>
              <div style={styles.showcaseTop}>
                <p style={styles.showcaseLabel}>Waiter Operations</p>
                <h3 style={styles.showcaseTitle}>Table Service and Order Flow</h3>
                <p style={styles.showcaseText}>
                  Waiters manage tables, see availability instantly, and start
                  service from a clean operational screen built for fast floor
                  movement.
                </p>
              </div>

              <div style={styles.showcaseImageWrap}>
                <Image
                  src="/images/waiter-screen.png"
                  alt="Ordinex waiter screen"
                  width={1600}
                  height={900}
                  style={styles.showcaseImage}
                />
              </div>
            </div>

            <div style={styles.showcaseCard}>
              <div style={styles.showcaseTop}>
                <p style={styles.showcaseLabel}>Cashier Console</p>
                <h3 style={styles.showcaseTitle}>Billing and Payment Control</h3>
                <p style={styles.showcaseText}>
                  Cashiers track pending bills, unpaid totals, cleared payments,
                  and transaction flow from one dedicated POS console.
                </p>
              </div>

              <div style={styles.showcaseImageWrap}>
                <Image
                  src="/images/cashier-screen.png"
                  alt="Ordinex cashier screen"
                  width={1600}
                  height={900}
                  style={styles.showcaseImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabelBlue}>Ordinex Solutions</p>
          <h2 style={styles.sectionTitleLight}>
            Structured for Different Business Models
          </h2>
          <p style={styles.sectionTextLight}>
            Ordinex is not one-size-fits-all. It is structured around the real
            workflows of restaurants, bars, hotels, and fuel stations.
          </p>

          <div style={styles.solutionBlocks}>
            <div style={styles.solutionBlock}>
              <div style={styles.solutionImageSide}>
                <div style={styles.solutionVisualCard}>
                  <div style={styles.solutionVisualGlow} />
                  <div style={styles.solutionVisualTitle}>Restaurant POS</div>
                  <div style={styles.solutionVisualLine} />
                  <div style={styles.solutionVisualLineShort} />
                  <div style={styles.solutionVisualTag}>Waiter → Kitchen → Cashier</div>
                </div>
              </div>

              <div style={styles.solutionTextSide}>
                <p style={styles.solutionLabel}>Restaurants & Cafés</p>
                <h3 style={styles.solutionTitle}>
                  Waiter Tablets, Kitchen Display, and Cashier Flow
                </h3>
                <p style={styles.solutionText}>
                  Ordinex gives restaurants and cafés waiter tablets for table
                  service, a kitchen display system for real-time order flow,
                  and a cashier console for billing, payment confirmation, and
                  faster table turnaround.
                </p>
              </div>
            </div>

            <div style={styles.solutionBlockReverse}>
              <div style={styles.solutionImageSide}>
                <div style={styles.solutionVisualCard}>
                  <div style={styles.solutionVisualGlow} />
                  <div style={styles.solutionVisualTitle}>Bar & Lounge POS</div>
                  <div style={styles.solutionVisualLine} />
                  <div style={styles.solutionVisualLineShort} />
                  <div style={styles.solutionVisualTag}>Tabs, VIP tables, payment control</div>
                </div>
              </div>

              <div style={styles.solutionTextSide}>
                <p style={styles.solutionLabel}>Bars & Lounges</p>
                <h3 style={styles.solutionTitle}>
                  Built for Tabs, Fast Drink Orders, and Night Shift Control
                </h3>
                <p style={styles.solutionText}>
                  Ordinex helps bars and lounges run open tabs, track multiple
                  drink orders, manage VIP tables, and keep cashier-controlled
                  payments under tighter operational control during busy nights.
                </p>
              </div>
            </div>

            <div style={styles.solutionBlock}>
              <div style={styles.solutionImageSide}>
                <div style={styles.solutionVisualCard}>
                  <div style={styles.solutionVisualGlow} />
                  <div style={styles.solutionVisualTitle}>Hotel Operations</div>
                  <div style={styles.solutionVisualLine} />
                  <div style={styles.solutionVisualLineShort} />
                  <div style={styles.solutionVisualTag}>Service coordination & visibility</div>
                </div>
              </div>

              <div style={styles.solutionTextSide}>
                <p style={styles.solutionLabel}>Hotels & Hospitality</p>
                <h3 style={styles.solutionTitle}>
                  Connected Staff Workflows Across Service Points
                </h3>
                <p style={styles.solutionText}>
                  Ordinex supports hospitality businesses with staff terminals,
                  cashier control, reporting visibility, and future cloud access
                  for owners who want connected service operations across the
                  property.
                </p>
              </div>
            </div>

            <div style={styles.solutionBlockReverse}>
              <div style={styles.solutionImageSide}>
                <div style={styles.solutionVisualCard}>
                  <div style={styles.solutionVisualGlow} />
                  <div style={styles.solutionVisualTitle}>Fuel Station POS</div>
                  <div style={styles.solutionVisualLine} />
                  <div style={styles.solutionVisualLineShort} />
                  <div style={styles.solutionVisualTag}>Attendant → Manager / Owner</div>
                </div>
              </div>

              <div style={styles.solutionTextSide}>
                <p style={styles.solutionLabel}>Fuel Stations</p>
                <h3 style={styles.solutionTitle}>
                  Attendant Devices with Direct Manager Visibility
                </h3>
                <p style={styles.solutionText}>
                  Fuel attendants use their own devices to record sales, liters,
                  and payment activity while managers or owners monitor totals,
                  performance, and shift-level movement from one connected
                  system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabelBlue}>Features</p>
          <h2 style={styles.sectionTitleLight}>
            A Full Commercial-Grade Operations Stack
          </h2>
          <p style={styles.sectionTextLight}>
            Ordinex is designed to cover the real-world needs of modern service
            businesses, from floor operations and payment control to reporting,
            permissions, and offline continuity.
          </p>

          <div style={styles.featureGridDark}>
            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Multi-Terminal System</h3>
              <p style={styles.featureTextLight}>
                Run Ordinex across waiter tablets, cashier POS, kitchen screens,
                and fuel attendant devices in one connected platform.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Waiter / Attendant Workflow</h3>
              <p style={styles.featureTextLight}>
                Support live service flow for restaurant waiters and fuel
                station attendants with role-specific devices and actions.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Kitchen Display System</h3>
              <p style={styles.featureTextLight}>
                Send orders instantly to the kitchen with clear status movement
                from New to Preparing to Ready.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Cashier POS and Payment Control</h3>
              <p style={styles.featureTextLight}>
                Track pending bills, payment types, cashier shift figures, and
                clearing flow from a dedicated cashier console.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>M-Pesa and Digital Payments</h3>
              <p style={styles.featureTextLight}>
                Ordinex is structured around real Kenyan payment behavior,
                including strong M-Pesa support and digital payment expansion.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Reports and Analytics</h3>
              <p style={styles.featureTextLight}>
                Build visibility around sales, expenses, shift activity, profit
                performance, and overall business movement.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Granular Roles and Permissions</h3>
              <p style={styles.featureTextLight}>
                Restrict access by role so waiters, cashiers, managers, kitchen
                staff, and attendants only see what they should control.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Offline-Capable Workflow</h3>
              <p style={styles.featureTextLight}>
                Keep operating during unstable internet conditions and sync data
                later when connectivity returns.
              </p>
            </div>

            <div style={styles.featureCardDark}>
              <h3 style={styles.featureTitleLight}>Cloud / Local Expansion Ready</h3>
              <p style={styles.featureTextLight}>
                Start locally and expand toward cloud backup, owner dashboards,
                and broader operational access over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabelBlue}>How It Works</p>
          <h2 style={styles.sectionTitleLight}>
            Simple Flow Across the Entire Business
          </h2>
          <p style={styles.sectionTextLight}>
            Ordinex is designed to connect staff terminals, operations flow,
            cashier payment control, and manager visibility without unnecessary
            complexity.
          </p>

          <div style={styles.workflowGridDark}>
            <div style={styles.workflowCardDark}>
              <div style={styles.stepNumber}>01</div>
              <h3 style={styles.workflowTitleLight}>Capture Activity</h3>
              <p style={styles.workflowTextLight}>
                Staff record service actions directly from their own device,
                whether they are waiters, cashiers, or fuel attendants.
              </p>
            </div>

            <div style={styles.workflowCardDark}>
              <div style={styles.stepNumber}>02</div>
              <h3 style={styles.workflowTitleLight}>Route to the Right Point</h3>
              <p style={styles.workflowTextLight}>
                Orders move instantly to the kitchen, bar, cashier, or relevant
                operational station for the next action.
              </p>
            </div>

            <div style={styles.workflowCardDark}>
              <div style={styles.stepNumber}>03</div>
              <h3 style={styles.workflowTitleLight}>Manage Payments and Shifts</h3>
              <p style={styles.workflowTextLight}>
                Cashiers and managers keep control of bills, payment methods,
                shifts, drawer expectations, and transaction clarity.
              </p>
            </div>

            <div style={styles.workflowCardDark}>
              <div style={styles.stepNumber}>04</div>
              <h3 style={styles.workflowTitleLight}>See Performance Clearly</h3>
              <p style={styles.workflowTextLight}>
                Owners and managers get better reporting, operational insight,
                and stronger visibility into what the business is doing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabelBlue}>Estimate Your Setup</p>
          <h2 style={styles.sectionTitleLight}>Build Your Ordinex Package</h2>
          <p style={styles.sectionTextLight}>
            Cashier POS and staff tablets are always part of the package. Choose
            your business type, enter the number of staff tablets you need, and
            add a kitchen display where applicable.
          </p>

          <div style={styles.calculatorWrapDark}>
            <div style={styles.calculatorFormCardDark}>
              <div style={styles.calculatorField}>
                <label style={styles.calculatorLabel}>Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => {
                    const value = e.target.value as BusinessType;
                    setBusinessType(value);
                    if (value === "fuel") {
                      setNeedsKitchenDisplay(false);
                    }
                  }}
                  style={styles.calculatorInput}
                >
                  <option value="">Choose business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="bar">Bar</option>
                  <option value="club">Lounge / Club</option>
                  <option value="hotel">Hotel / Hospitality</option>
                  <option value="fuel">Fuel Station</option>
                </select>
              </div>

              <div style={styles.calculatorField}>
                <label style={styles.calculatorLabel}>Number of Staff Tablets</label>

                <div style={styles.numberInputWrap}>
                  <button
                    type="button"
                    style={styles.numberButton}
                    onClick={decreaseTablets}
                  >
                    -
                  </button>

                  <input
                    value={tabletCount}
                    onChange={(e) => handleTabletInputChange(e.target.value)}
                    type="number"
                    min={1}
                    max={20}
                    style={styles.numberInput}
                  />

                  <button
                    type="button"
                    style={styles.numberButton}
                    onClick={increaseTablets}
                  >
                    +
                  </button>
                </div>

                <p style={styles.helperText}>
                  Cashier POS is always included. Tablets are calculated by the
                  number you enter.
                </p>
              </div>

              {showKitchenOption ? (
                <div style={styles.calculatorFieldFull}>
                  <label style={styles.calculatorLabel}>
                    Do You Want a Kitchen Display?
                  </label>

                  <div style={styles.toggleRow}>
                    <button
                      type="button"
                      onClick={() => setNeedsKitchenDisplay(true)}
                      style={{
                        ...styles.toggleButton,
                        ...(needsKitchenDisplay ? styles.toggleButtonActive : {}),
                      }}
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={() => setNeedsKitchenDisplay(false)}
                      style={{
                        ...styles.toggleButton,
                        ...(!needsKitchenDisplay ? styles.toggleButtonActive : {}),
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div style={styles.resultCardDark}>
              <p style={styles.resultLabelBlue}>Estimated Package</p>
              <h3 style={styles.resultBusinessLight}>
                {businessType ? getBusinessLabel(businessType) : "Your Business"}
              </h3>

              <div style={styles.resultBreakdownDark}>
                <div style={styles.resultRowDark}>
                  <span>Cashier POS</span>
                  <strong>KES {estimate.cashierCost.toLocaleString()}</strong>
                </div>

                <div style={styles.resultRowDark}>
                  <span>Staff Tablets ({tabletCount})</span>
                  <strong>KES {estimate.tabletCost.toLocaleString()}</strong>
                </div>

                {showKitchenOption ? (
                  <div style={styles.resultRowDark}>
                    <span>Kitchen Display</span>
                    <strong>KES {estimate.kitchenCost.toLocaleString()}</strong>
                  </div>
                ) : null}

                <div style={styles.resultRowDark}>
                  <span>Installation</span>
                  <strong>KES {estimate.installationCost.toLocaleString()}</strong>
                </div>
              </div>

              <div style={styles.totalBoxDark}>
                <span style={styles.totalTextBlue}>Estimated Total</span>
                <div style={styles.totalAmountLight}>
                  KES {estimate.total.toLocaleString()}
                </div>
              </div>

              <div style={styles.resultNotesDark}>
                <div style={styles.resultNoteDark}>Cashier POS included</div>
                <div style={styles.resultNoteDark}>Tablets included</div>
                {showKitchenOption && needsKitchenDisplay ? (
                  <div style={styles.resultNoteDark}>Kitchen display included</div>
                ) : null}
                <div style={styles.resultNoteDark}>Installation included</div>
              </div>

              <div style={styles.resultButtons}>
                <button type="button" style={styles.resultPrimaryButton}>
                  Estimate Ready
                </button>

                <button
                  type="button"
                  style={styles.resultSecondaryButtonDark}
                  onClick={openQuoteForm}
                >
                  Get Real Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <div style={styles.contactCardDark}>
            <p style={styles.sectionLabelBlue}>Contact</p>
            <h2 style={styles.contactTitleLight}>Ready to Talk About Ordinex?</h2>
            <p style={styles.contactTextLight}>
              Reach out for demos, pricing, setup discussions, or installation
              inquiries.
            </p>

            <div style={styles.contactButtonsWrap}>
              <a href="mailto:hello@ordinex.co" style={styles.contactButtonBlue}>
                Email Us
              </a>

              <a href="tel:0769753581" style={styles.contactButtonOutline}>
                Call Us
              </a>

              <a href="https://wa.me/254769753581" style={styles.contactButtonOutline}>
                WhatsApp Us
              </a>
            </div>

            <div style={styles.contactDetails}>
              <div style={styles.contactDetailItem}>Phone: 0769753581</div>
              <div style={styles.contactDetailItem}>WhatsApp: 0769753581</div>
              <div style={styles.contactDetailItem}>Email: hello@ordinex.co</div>
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
    background: "#030816",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  hero: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#030816",
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(3,8,22,0.68), rgba(3,8,22,0.92))",
  },

  nav: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1280,
    margin: "0 auto",
    padding: "20px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: "auto",
    height: "48px",
    borderRadius: "10px",
    objectFit: "contain",
  },
  navLinks: {
    display: "flex",
    gap: 18,
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
    color: "#ffffff",
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 700,
    boxShadow: "0 0 20px rgba(63,102,255,0.4)",
    border: "1px solid rgba(82,126,255,0.45)",
    cursor: "pointer",
    fontSize: 14,
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    minHeight: "calc(100vh - 90px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px 70px",
  },
  formCard: {
    width: "100%",
    maxWidth: 800,
    borderRadius: 30,
    padding: 24,
    background: "rgba(7, 16, 40, 0.78)",
    border: "1px solid rgba(76,117,255,0.28)",
    boxShadow:
      "0 0 38px rgba(50,92,255,0.20), 0 0 90px rgba(36,69,195,0.12)",
    backdropFilter: "blur(20px)",
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(40,83,255,0.18)",
    border: "1px solid rgba(98,142,255,0.3)",
    color: "#9fc1ff",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 18,
  },
  title: {
    margin: "0 0 14px 0",
    fontSize: "clamp(32px, 6vw, 56px)",
    lineHeight: 1.04,
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: -1.5,
  },
  subtitle: {
    margin: 0,
    color: "rgba(255,255,255,0.78)",
    fontSize: "clamp(15px, 2.4vw, 18px)",
    lineHeight: 1.75,
  },
  points: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 22,
    marginBottom: 22,
  },
  point: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbe7ff",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(96,165,250,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },
  buttonRow: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: 12,
    marginTop: 6,
    flexWrap: "wrap",
  },
  submitButton: {
    flex: 1,
    minWidth: "220px",
    padding: "16px 18px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 0 22px rgba(63,102,255,0.45)",
  },
  secondaryButtonHero: {
    flex: 1,
    minWidth: "220px",
    padding: "16px 18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },

  sectionDark: {
    background: "#030816",
    color: "#ffffff",
    padding: "84px 16px",
  },
  sectionInner: {
    maxWidth: 1280,
    margin: "0 auto",
  },
  sectionLabelBlue: {
    margin: 0,
    color: "#78a5ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionTitleLight: {
    margin: "12px 0 18px 0",
    fontSize: "clamp(28px, 4.5vw, 44px)",
    lineHeight: 1.08,
    fontWeight: 800,
    letterSpacing: -1,
    color: "#ffffff",
  },
  sectionTextLight: {
    margin: "0 0 30px 0",
    color: "rgba(255,255,255,0.72)",
    fontSize: "clamp(15px, 2.2vw, 18px)",
    lineHeight: 1.75,
    maxWidth: 860,
  },

  gridDark: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
  },
  cardDark: {
    background: "rgba(9, 17, 42, 0.95)",
    border: "1px solid rgba(70,110,255,0.2)",
    borderRadius: 24,
    padding: 24,
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    boxShadow: "0 0 24px rgba(29,68,255,0.08)",
    color: "#ffffff",
  },

  showcaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 22,
  },
  showcaseCard: {
    background: "rgba(9, 17, 42, 0.96)",
    border: "1px solid rgba(70,110,255,0.24)",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 0 26px rgba(29,68,255,0.10)",
  },
  showcaseTop: {
    padding: 22,
  },
  showcaseLabel: {
    margin: 0,
    color: "#78a5ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  showcaseTitle: {
    margin: "10px 0 10px 0",
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.12,
  },
  showcaseText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 1.75,
  },
  showcaseImageWrap: {
    padding: "0 22px 22px 22px",
  },
  showcaseImage: {
    width: "100%",
    height: "auto",
    borderRadius: "22px",
    border: "1px solid rgba(89,128,255,0.22)",
    boxShadow: "0 0 25px rgba(44,80,220,0.10)",
  },

  solutionBlocks: {
    display: "grid",
    gap: 24,
  },
  solutionBlock: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 22,
    alignItems: "center",
    background: "rgba(9, 17, 42, 0.96)",
    border: "1px solid rgba(70,110,255,0.22)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 0 24px rgba(29,68,255,0.08)",
  },
  solutionBlockReverse: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 22,
    alignItems: "center",
    background: "rgba(9, 17, 42, 0.96)",
    border: "1px solid rgba(70,110,255,0.22)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 0 24px rgba(29,68,255,0.08)",
  },
  solutionImageSide: {
    display: "flex",
    justifyContent: "center",
  },
  solutionTextSide: {},
  solutionVisualCard: {
    width: "100%",
    maxWidth: 420,
    minHeight: 220,
    borderRadius: 24,
    padding: 24,
    background:
      "linear-gradient(180deg, rgba(22,34,78,0.95) 0%, rgba(8,15,35,0.98) 100%)",
    border: "1px solid rgba(89,128,255,0.24)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 0 26px rgba(44,80,220,0.12)",
  },
  solutionVisualGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "rgba(63,102,255,0.20)",
    filter: "blur(50px)",
    top: -40,
    right: -20,
  },
  solutionVisualTitle: {
    position: "relative",
    zIndex: 1,
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 22,
  },
  solutionVisualLine: {
    position: "relative",
    zIndex: 1,
    height: 14,
    borderRadius: 999,
    background: "rgba(122,160,255,0.32)",
    marginBottom: 12,
  },
  solutionVisualLineShort: {
    position: "relative",
    zIndex: 1,
    height: 14,
    width: "68%",
    borderRadius: 999,
    background: "rgba(122,160,255,0.22)",
    marginBottom: 20,
  },
  solutionVisualTag: {
    position: "relative",
    zIndex: 1,
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.15)",
    color: "#b8d0ff",
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid rgba(89,128,255,0.18)",
  },
  solutionLabel: {
    margin: 0,
    color: "#78a5ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  solutionTitle: {
    margin: "10px 0 12px 0",
    color: "#ffffff",
    fontSize: 30,
    fontWeight: 800,
    lineHeight: 1.12,
  },
  solutionText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    lineHeight: 1.8,
  },

  featureGridDark: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  featureCardDark: {
    background: "rgba(9, 17, 42, 0.95)",
    border: "1px solid rgba(70,110,255,0.22)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 0 24px rgba(29,68,255,0.07)",
  },
  featureTitleLight: {
    margin: "0 0 12px 0",
    fontSize: 22,
    fontWeight: 700,
    color: "#ffffff",
  },
  featureTextLight: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 1.75,
  },

  workflowGridDark: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },
  workflowCardDark: {
    background: "rgba(9, 17, 42, 0.95)",
    border: "1px solid rgba(70,110,255,0.22)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 0 24px rgba(29,68,255,0.07)",
  },
  stepNumber: {
    width: 52,
    height: 52,
    borderRadius: 999,
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    marginBottom: 18,
    boxShadow: "0 0 18px rgba(63,102,255,0.3)",
  },
  workflowTitleLight: {
    margin: "0 0 10px 0",
    fontSize: 22,
    fontWeight: 700,
    color: "#ffffff",
  },
  workflowTextLight: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 1.75,
  },

  calculatorWrapDark: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 22,
    alignItems: "start",
  },
  calculatorFormCardDark: {
    background: "rgba(9, 17, 42, 0.96)",
    borderRadius: 28,
    padding: 26,
    border: "1px solid rgba(70,110,255,0.24)",
    boxShadow: "0 0 28px rgba(29,68,255,0.10)",
  },
  calculatorField: {
    marginBottom: 18,
  },
  calculatorFieldFull: {
    marginBottom: 4,
  },
  calculatorLabel: {
    display: "block",
    marginBottom: 10,
    color: "#dbe7ff",
    fontSize: 14,
    fontWeight: 700,
  },
  calculatorInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(96,165,250,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },
  numberInputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  numberButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    border: "1px solid rgba(89,128,255,0.28)",
    background: "rgba(29,68,255,0.18)",
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
    border: "1px solid rgba(96,165,250,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 16,
    outline: "none",
    textAlign: "center",
  },
  helperText: {
    margin: "10px 0 0 0",
    color: "rgba(255,255,255,0.58)",
    fontSize: 13,
    lineHeight: 1.6,
  },
  toggleRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  toggleButton: {
    flex: 1,
    minWidth: "120px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  toggleButtonActive: {
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    border: "1px solid rgba(63,102,255,0.7)",
    boxShadow: "0 0 18px rgba(63,102,255,0.28)",
  },

  resultCardDark: {
    background: "rgba(9, 17, 42, 0.96)",
    borderRadius: 28,
    padding: 26,
    border: "1px solid rgba(70,110,255,0.24)",
    boxShadow: "0 0 28px rgba(29,68,255,0.10)",
  },
  resultLabelBlue: {
    margin: 0,
    color: "#78a5ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  resultBusinessLight: {
    margin: "10px 0 18px 0",
    fontSize: 32,
    fontWeight: 800,
    color: "#ffffff",
  },
  resultBreakdownDark: {
    display: "grid",
    gap: 12,
    marginBottom: 22,
  },
  resultRowDark: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid rgba(89,128,255,0.16)",
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
  },
  totalBoxDark: {
    borderRadius: 22,
    padding: 22,
    background:
      "linear-gradient(135deg, rgba(24,68,255,0.22), rgba(63,102,255,0.18))",
    border: "1px solid rgba(89,128,255,0.26)",
    marginBottom: 18,
    boxShadow: "0 0 24px rgba(63,102,255,0.12)",
  },
  totalTextBlue: {
    display: "block",
    color: "#9fc1ff",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  totalAmountLight: {
    color: "#ffffff",
    fontSize: "clamp(30px, 5vw, 38px)",
    fontWeight: 800,
    lineHeight: 1.1,
  },
  resultNotesDark: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  resultNoteDark: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(49,90,255,0.15)",
    color: "#b8d0ff",
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid rgba(89,128,255,0.18)",
  },
  resultButtons: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  resultPrimaryButton: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  resultSecondaryButtonDark: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(89,128,255,0.35)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },

  contactCardDark: {
    maxWidth: 1280,
    margin: "0 auto",
    background: "rgba(9, 17, 42, 0.96)",
    borderRadius: 30,
    padding: 34,
    border: "1px solid rgba(70,110,255,0.24)",
    boxShadow: "0 0 30px rgba(29,68,255,0.10)",
    textAlign: "center",
  },
  contactTitleLight: {
    fontSize: "clamp(28px, 4.5vw, 44px)",
    lineHeight: 1.12,
    margin: "12px 0 14px 0",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: -1,
  },
  contactTextLight: {
    margin: "0 auto",
    color: "rgba(255,255,255,0.72)",
    fontSize: "clamp(15px, 2.2vw, 18px)",
    lineHeight: 1.75,
    maxWidth: 760,
  },
  contactButtonsWrap: {
    display: "flex",
    justifyContent: "center",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 28,
  },
  contactButtonBlue: {
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    color: "#ffffff",
    padding: "14px 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 15,
    display: "inline-block",
    minWidth: "160px",
  },
  contactButtonOutline: {
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    padding: "14px 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 15,
    border: "1px solid rgba(255,255,255,0.12)",
    display: "inline-block",
    minWidth: "160px",
  },
  contactDetails: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
  },
  contactDetailItem: {
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
    background: "rgba(2, 6, 23, 0.75)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 24,
    padding: 24,
    background: "rgba(9, 17, 42, 0.98)",
    border: "1px solid rgba(70,110,255,0.24)",
    boxShadow: "0 0 30px rgba(29,68,255,0.14)",
  },
  modalLabel: {
    margin: 0,
    color: "#78a5ff",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  modalTitle: {
    margin: "10px 0 12px 0",
    fontSize: 30,
    lineHeight: 1.15,
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
    gap: 14,
    marginTop: 22,
  },
  modalInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(96,165,250,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
  },
  modalButtons: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 6,
  },
  modalPrimaryButton: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #1844ff, #3f66ff)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  modalSecondaryButton: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
};