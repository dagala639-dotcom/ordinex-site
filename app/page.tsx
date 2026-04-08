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

type StoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

const STORY_STEPS: StoryStep[] = [
  {
    id: "waiter",
    eyebrow: "Waiter Order Flow",
    title: "Take orders instantly from the table.",
    text:
      "Staff browse menu items, add notes, adjust quantity, and send the order in seconds from a clean tablet-first interface designed for speed, clarity, and low-error service during busy hours.",
    image: "/images/orders.png",
    alt: "Ordinex waiter order screen",
  },
  {
    id: "kitchen",
    eyebrow: "Kitchen Display System",
    title: "Orders move straight to the kitchen.",
    text:
      "Kitchen teams see new, preparing, and ready orders in one live screen so production stays fast, organised, and easy to track without relying on verbal communication or handwritten tickets.",
    image: "/images/kitchen-screen.png",
    alt: "Ordinex kitchen display screen",
  },
  {
    id: "cashier",
    eyebrow: "Cashier Control",
    title: "Keep billing and payment under tight control.",
    text:
      "Cashiers manage bills, confirm payment methods, track totals, and maintain better payment accountability from a central screen built for busy day-to-day operations.",
    image: "/images/cashier-screen.png",
    alt: "Ordinex cashier screen",
  },
  {
    id: "owner",
    eyebrow: "Business Visibility",
    title: "See what is happening across the business.",
    text:
      "Managers and owners get clean operational visibility across sales, staff activity, pending items, and performance trends from one connected reporting layer.",
    image: "/images/owner-dashboard.png",
    alt: "Ordinex owner dashboard",
  },
];

export default function HomePage() {
  const [businessType, setBusinessType] = useState<BusinessType>("");
  const [tabletCount, setTabletCount] = useState(2);
  const [needsKitchenDisplay, setNeedsKitchenDisplay] = useState(false);

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 900);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = STORY_STEPS.map((step) =>
        document.getElementById(`story-trigger-${step.id}`)
      ).filter(Boolean) as HTMLElement[];

      if (!sections.length) return;

      let currentIndex = 0;
      const viewportPoint = window.innerHeight * 0.42;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportPoint) {
          currentIndex = index;
        }
      });

      setActiveStory(currentIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

        <nav style={{ ...styles.nav, ...(isMobile ? styles.navMobile : {}) }}>
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
              <a href="#product-story" style={styles.navLink}>
                Product
              </a>
              <a href="#solutions" style={styles.navLink}>
                Solutions
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
            style={{ ...styles.navButton, ...(isMobile ? styles.navButtonMobile : {}) }}
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
              One connected operations system for restaurants, hotels, bars, lounges, and fuel stations.
            </h1>

            <p style={styles.heroText}>
              Ordinex brings together ordering, kitchen flow, cashier control,
              fuel sales capture, shift visibility, and business reporting in
              one premium operational platform.
            </p>

            <div style={styles.heroActions}>
              <button
                style={styles.heroPrimaryButton}
                onClick={() => scrollToSection("product-story")}
              >
                View Product Flow
              </button>

              <button
                style={styles.heroSecondaryButton}
                onClick={() => scrollToSection("calculator")}
              >
                Estimate Your Setup
              </button>
            </div>

            <div
              style={{
                ...styles.heroMiniStats,
                ...(isMobile ? styles.heroMiniStatsMobile : {}),
              }}
            >
              <div style={styles.heroMiniStat}>
                <div style={styles.heroMiniLabel}>Floor Operations</div>
                <div style={styles.heroMiniValue}>Waiter tablets and table flow</div>
              </div>
              <div style={styles.heroMiniStat}>
                <div style={styles.heroMiniLabel}>Kitchen Coordination</div>
                <div style={styles.heroMiniValue}>Live KDS status and production flow</div>
              </div>
              <div style={styles.heroMiniStat}>
                <div style={styles.heroMiniLabel}>Business Visibility</div>
                <div style={styles.heroMiniValue}>Cashier, manager, owner, and fuel reporting</div>
              </div>
            </div>
          </div>

          <div style={styles.heroShowcaseShell}>
            <div style={styles.heroShowcaseCard}>
              <div style={styles.heroShowcaseHeader}>
                <div>
                  <div style={styles.heroShowcaseTag}>Live Product</div>
                  <h3 style={styles.heroShowcaseTitle}>See how the system works</h3>
                </div>
                <div style={styles.heroStatusPill}>Realtime</div>
              </div>

              <div style={styles.heroShowcaseImageWrap}>
                <Image
                  src="/images/orders.png"
                  alt="Ordinex waiter order screen"
                  width={1600}
                  height={900}
                  style={styles.heroShowcaseImage}
                />
              </div>

              <div style={styles.heroShowcaseFooter}>
                <div style={styles.heroShowcaseFooterCard}>
                  <div style={styles.heroShowcaseFooterLabel}>Orders</div>
                  <div style={styles.heroShowcaseFooterText}>
                    Staff take orders with a clean, tablet-first workflow.
                  </div>
                </div>
                <div style={styles.heroShowcaseFooterCard}>
                  <div style={styles.heroShowcaseFooterLabel}>Kitchen</div>
                  <div style={styles.heroShowcaseFooterText}>
                    Orders move directly to production with live status updates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="product-story">
        <div style={styles.sectionInnerWide}>
          <div
            style={{
              ...styles.sectionHeaderCenter,
              ...(isMobile ? styles.sectionHeaderCenterMobile : {}),
            }}
          >
            <div>
              <div style={styles.sectionEyebrow}>Product Story</div>
              <h2 style={styles.sectionTitleCenter}>
                See how Ordinex works from order to oversight
              </h2>
            </div>
            <p style={styles.sectionCopyCenter}>
              Start with the product visual, then scroll through the detailed
              story of how orders are captured, routed, paid, and monitored.
            </p>
          </div>

          <div style={styles.storyExperience}>
            <div style={styles.storyStickyVisualShell}>
              <div style={styles.storyStickyCardLarge}>
                <div style={styles.storyVisualHeaderLarge}>
                  <div style={styles.storyVisualHeaderLeft}>
                    <div style={styles.storyVisualTag}>Ordinex Workflow</div>
                    <div style={styles.storyVisualDots}>
                      {STORY_STEPS.map((step, index) => (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => {
                            const element = document.getElementById(`story-trigger-${step.id}`);
                            if (element) {
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                          }}
                          style={{
                            ...styles.storyDot,
                            ...(activeStory === index ? styles.storyDotActive : {}),
                          }}
                          aria-label={`Go to ${step.title}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={styles.storyVisualStatus}>
                    {activeStory + 1}/{STORY_STEPS.length}
                  </div>
                </div>

                <div style={styles.storyImageFrameLarge}>
                  <Image
                    src={STORY_STEPS[activeStory].image}
                    alt={STORY_STEPS[activeStory].alt}
                    width={1600}
                    height={900}
                    style={styles.storyImageLarge}
                  />
                </div>
              </div>
            </div>

            <div style={styles.storyDescriptions}>
              {STORY_STEPS.map((step, index) => {
                const isActive = activeStory === index;

                return (
                  <div
                    key={step.id}
                    id={`story-trigger-${step.id}`}
                    style={{
                      ...styles.storyDescriptionBlock,
                      ...(isActive ? styles.storyDescriptionBlockActive : {}),
                    }}
                  >
                    <div style={styles.storyDescriptionInner}>
                      <div style={styles.storyEyebrow}>{step.eyebrow}</div>
                      <h3 style={styles.storyTitle}>{step.title}</h3>
                      <p style={styles.storyText}>{step.text}</p>

                      <div style={styles.storySupportGrid}>
                        <div style={styles.storySupportCard}>
                          <div style={styles.storySupportTitle}>Operational value</div>
                          <div style={styles.storySupportText}>
                            Faster workflows with cleaner staff interaction and better control at the point of action.
                          </div>
                        </div>

                        <div style={styles.storySupportCard}>
                          <div style={styles.storySupportTitle}>What this improves</div>
                          <div style={styles.storySupportText}>
                            Better speed, clearer accountability, fewer manual errors, and a more connected business flow.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <div style={styles.sectionEyebrow}>Additional Screens</div>
              <h2 style={styles.sectionTitle}>Built for different roles across the business</h2>
            </div>
            <p style={styles.sectionCopy}>
              Beyond the core flow, Ordinex gives each role the tools they need
              to operate with speed, clarity, and control.
            </p>
          </div>

          <div style={styles.productStack}>
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
                    expected in hand for stronger shift control.
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
                    <div style={styles.productPanelTag}>Manager Console</div>
                    <h3 style={styles.productPanelSmallTitle}>
                      Daily operational control
                    </h3>
                    <p style={styles.productPanelSmallText}>
                      Managers track sales, expenses, labour, stock activity,
                      supplier movements, and pending operational items in one
                      central console.
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

              <div style={styles.productPanelMedium}>
                <div style={styles.productPanelTop}>
                  <div>
                    <div style={styles.productPanelTag}>Owner Dashboard</div>
                    <h3 style={styles.productPanelSmallTitle}>
                      Executive visibility for owners
                    </h3>
                    <p style={styles.productPanelSmallText}>
                      View business performance, top-selling items, operational
                      trends, and commercial visibility from one premium summary
                      screen.
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
              Ordinex is built around real operational flow, not generic software screens.
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
                Waiter → Kitchen → Cashier
              </h3>
              <p style={styles.solutionText}>
                Waiters create orders from tablets, kitchen receives them
                instantly, and cashiers maintain payment control from one system.
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
                Fast service with tighter billing visibility
              </h3>
              <p style={styles.solutionText}>
                Manage open tabs, repeated drink orders, fast floor movement,
                and cashier-controlled collection during busy nights.
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
                Connected service and management control
              </h3>
              <p style={styles.solutionText}>
                Coordinate service points, staff flow, reporting visibility,
                and business monitoring inside one connected environment.
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
                Attendant → Shift summary → Management
              </h3>
              <p style={styles.solutionText}>
                Fuel attendants record sales, litres are calculated instantly,
                and managers get clearer shift-level accountability.
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
              <div style={styles.sectionEyebrow}>Core Capabilities</div>
              <h2 style={styles.sectionTitle}>A connected commercial operations stack</h2>
            </div>
            <p style={styles.sectionCopy}>
              The platform is built around operational control, payment visibility,
              and business-level insight.
            </p>
          </div>

          <div
            style={{
              ...styles.featureColumns,
              ...(isMobile ? styles.featureColumnsMobile : {}),
            }}
          >
            <div style={styles.featureColumn}>
              <div style={styles.featureGroupTitle}>Operations Control</div>
              <div style={styles.featureItem}>Tablet-based ordering and task flow</div>
              <div style={styles.featureItem}>Kitchen display routing and status updates</div>
              <div style={styles.featureItem}>Shift-aware device workflows</div>
              <div style={styles.featureItem}>Multi-role operational coordination</div>
            </div>

            <div style={styles.featureColumn}>
              <div style={styles.featureGroupTitle}>Payment Visibility</div>
              <div style={styles.featureItem}>Cash, M-Pesa, and card support</div>
              <div style={styles.featureItem}>Cashier-controlled billing confirmation</div>
              <div style={styles.featureItem}>Fuel and service payment tracking</div>
              <div style={styles.featureItem}>End-of-shift accountability</div>
            </div>

            <div style={styles.featureColumn}>
              <div style={styles.featureGroupTitle}>Reporting & Insight</div>
              <div style={styles.featureItem}>Manager dashboards and business summaries</div>
              <div style={styles.featureItem}>Owner visibility across operations</div>
              <div style={styles.featureItem}>Roles, permissions, and control layers</div>
              <div style={styles.featureItem}>Offline-ready expansion direction</div>
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
              <div style={styles.workflowStepTitle}>Record</div>
              <div style={styles.workflowStepText}>
                Staff use dedicated devices to capture orders, bills, or fuel sales.
              </div>
            </div>

            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>02</div>
              <div style={styles.workflowStepTitle}>Route</div>
              <div style={styles.workflowStepText}>
                Activity moves automatically to kitchen, cashier, or management flow.
              </div>
            </div>

            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>03</div>
              <div style={styles.workflowStepTitle}>Confirm</div>
              <div style={styles.workflowStepText}>
                Payments and operational actions are confirmed in the right control point.
              </div>
            </div>

            <div style={styles.workflowStep}>
              <div style={styles.workflowNumber}>04</div>
              <div style={styles.workflowStepTitle}>Monitor</div>
              <div style={styles.workflowStepText}>
                Managers and owners get cleaner visibility over business performance.
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
              Cashier POS and staff tablets form the base setup. Add kitchen display where needed.
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
              Reach out for demos, pricing, setup planning, or installation discussions.
            </p>

            <div style={styles.contactButtons}>
              <a href="mailto:hello@ordinex.co" style={styles.contactPrimaryButton}>
                <span style={styles.contactButtonLabel}>Email Us</span>
                <span style={styles.contactButtonSubtext}>hello@ordinex.co</span>
              </a>

              <a href="tel:0769753581" style={styles.contactSecondaryButton}>
                <span style={styles.contactButtonLabel}>Call Us</span>
                <span style={styles.contactButtonSubtext}>0769753581</span>
              </a>

              <a
                href="https://wa.me/254769753581"
                style={styles.contactSecondaryButton}
              >
                <span style={styles.contactButtonLabel}>WhatsApp Us</span>
                <span style={styles.contactButtonSubtext}>0769753581</span>
              </a>
            </div>

            <div style={styles.contactFormWrap}>
              <div style={styles.contactFormHeader}>
                <div style={styles.formLabel}>Request a demo</div>
                <h3 style={styles.formTitle}>See Ordinex in action</h3>
                <p style={styles.formText}>
                  Tell us about your business and we’ll prepare the right setup direction for you.
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
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    margin: 0,
    background: "#030712",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    scrollBehavior: "smooth",
  },

  hero: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#030712",
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
      "linear-gradient(180deg, rgba(3,7,18,0.54) 0%, rgba(3,7,18,0.84) 55%, rgba(3,7,18,0.98) 100%)",
  },
  heroGlowOne: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "rgba(47, 101, 255, 0.12)",
    filter: "blur(130px)",
    top: -120,
    left: -120,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "rgba(41, 84, 255, 0.08)",
    filter: "blur(120px)",
    bottom: -120,
    right: -120,
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
    backgroundSize: "46px 46px",
    pointerEvents: "none",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.72), transparent)",
  },

  nav: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1280,
    margin: "0 auto",
    padding: "24px 20px",
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
    height: "44px",
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
    color: "rgba(255,255,255,0.76)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
  navButton: {
    background: "#ffffff",
    color: "#030712",
    border: "1px solid rgba(255,255,255,0.15)",
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
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: 36,
    alignItems: "center",
    padding: "20px 20px 88px",
  },
  heroInnerMobile: {
    gridTemplateColumns: "1fr",
    padding: "18px 16px 56px",
    gap: 26,
  },
  heroCopy: {
    maxWidth: 720,
  },
  heroPill: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 18,
  },
  heroTitle: {
    margin: "0 0 16px 0",
    fontSize: "clamp(38px, 7vw, 78px)",
    lineHeight: 1.02,
    letterSpacing: -2.2,
    fontWeight: 800,
    color: "#ffffff",
    maxWidth: 860,
  },
  heroTitleMobile: {
    fontSize: "42px",
    lineHeight: 1.04,
    letterSpacing: -1.4,
  },
  heroText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: "clamp(16px, 2vw, 19px)",
    lineHeight: 1.8,
    maxWidth: 650,
  },
  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 28,
    marginBottom: 32,
  },
  heroPrimaryButton: {
    padding: "15px 20px",
    borderRadius: 14,
    border: "none",
    background: "#ffffff",
    color: "#030712",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
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
  heroMiniStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  heroMiniStatsMobile: {
    gridTemplateColumns: "1fr",
  },
  heroMiniStat: {
    padding: "0 8px 0 0",
  },
  heroMiniLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 8,
  },
  heroMiniValue: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 14,
    lineHeight: 1.65,
  },

  heroShowcaseShell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroShowcaseCard: {
    width: "100%",
    maxWidth: 620,
    background: "linear-gradient(180deg, rgba(12,18,35,0.9), rgba(8,12,24,0.92))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 32,
    padding: 22,
    boxShadow: "0 24px 70px rgba(0,0,0,0.34)",
    backdropFilter: "blur(16px)",
  },
  heroShowcaseHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  heroShowcaseTag: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#b8c6ff",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroShowcaseTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  heroStatusPill: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.16)",
    color: "#86efac",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  heroShowcaseImageWrap: {
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    boxShadow: "0 20px 44px rgba(0,0,0,0.28)",
  },
  heroShowcaseImage: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  heroShowcaseFooter: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 14,
  },
  heroShowcaseFooterCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 14,
  },
  heroShowcaseFooterLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
  },
  heroShowcaseFooterText: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 13,
    lineHeight: 1.6,
  },

  section: {
    background: "#030712",
    padding: "110px 16px",
  },
  sectionInner: {
    maxWidth: 1180,
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
    marginBottom: 36,
  },
  sectionHeaderMobile: {
    alignItems: "start",
    gap: 14,
  },
  sectionHeaderCenter: {
    maxWidth: 940,
    margin: "0 auto 42px auto",
    textAlign: "center",
  },
  sectionHeaderCenterMobile: {
    marginBottom: 28,
  },
  sectionEyebrow: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 12,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "clamp(30px, 4.6vw, 54px)",
    lineHeight: 1.06,
    letterSpacing: -1.4,
    fontWeight: 800,
    color: "#ffffff",
    maxWidth: 800,
  },
  sectionTitleCenter: {
    margin: "0 auto",
    fontSize: "clamp(30px, 4.6vw, 54px)",
    lineHeight: 1.06,
    letterSpacing: -1.4,
    fontWeight: 800,
    color: "#ffffff",
    maxWidth: 900,
  },
  sectionCopy: {
    margin: 0,
    maxWidth: 470,
    color: "rgba(255,255,255,0.68)",
    fontSize: 16,
    lineHeight: 1.8,
  },
  sectionCopyCenter: {
    margin: "18px auto 0 auto",
    maxWidth: 700,
    color: "rgba(255,255,255,0.68)",
    fontSize: 16,
    lineHeight: 1.8,
  },

  storyExperience: {
    position: "relative",
  },
  storyStickyVisualShell: {
    position: "sticky",
    top: 86,
    zIndex: 2,
    marginBottom: 40,
  },
  storyStickyCardLarge: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 34,
    padding: 24,
    boxShadow: "0 28px 80px rgba(0,0,0,0.3)",
    maxWidth: 1120,
    margin: "0 auto",
  },
  storyVisualHeaderLarge: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  storyVisualHeaderLeft: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  storyVisualTag: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbe4ff",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  storyVisualDots: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  storyDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.18)",
    cursor: "pointer",
    padding: 0,
  },
  storyDotActive: {
    background: "#ffffff",
    transform: "scale(1.15)",
  },
  storyVisualStatus: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: 700,
  },
  storyImageFrameLarge: {
    borderRadius: 26,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    minHeight: "auto",
  },
  storyImageLarge: {
    width: "100%",
    height: "auto",
    display: "block",
  },

  storyDescriptions: {
    display: "grid",
    gap: 10,
    maxWidth: 1120,
    margin: "0 auto",
  },
  storyDescriptionBlock: {
    minHeight: "85vh",
    display: "flex",
    alignItems: "flex-end",
    opacity: 0.45,
    transition: "opacity 240ms ease, transform 240ms ease",
    transform: "translateY(18px)",
  },
  storyDescriptionBlockActive: {
    opacity: 1,
    transform: "translateY(0)",
  },
  storyDescriptionInner: {
    width: "100%",
    maxWidth: 760,
    padding: "14px 4px 30px 4px",
  },
  storyTitle: {
    margin: "0 0 14px 0",
    fontSize: "clamp(32px, 4vw, 52px)",
    lineHeight: 1.04,
    letterSpacing: -1.2,
    fontWeight: 800,
    color: "#ffffff",
  },
  storyText: {
    margin: 0,
    color: "rgba(255,255,255,0.74)",
    fontSize: 18,
    lineHeight: 1.85,
    maxWidth: 760,
  },
  storySupportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 28,
  },
  storySupportCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 18,
  },
  storySupportTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  storySupportText: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 14,
    lineHeight: 1.7,
  },

  productStack: {
    display: "grid",
    gap: 24,
  },
  productPanelLarge: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 30,
    padding: 26,
    boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
  },
  productPanelMedium: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 22,
    boxShadow: "0 16px 36px rgba(0,0,0,0.2)",
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbe4ff",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  productPanelTitle: {
    margin: "0 0 10px 0",
    fontSize: "clamp(26px, 4vw, 38px)",
    lineHeight: 1.08,
    fontWeight: 800,
    color: "#ffffff",
  },
  productPanelSmallTitle: {
    margin: "0 0 10px 0",
    fontSize: "clamp(22px, 3vw, 30px)",
    lineHeight: 1.12,
    fontWeight: 800,
    color: "#ffffff",
  },
  productPanelText: {
    margin: 0,
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 820,
  },
  productPanelSmallText: {
    margin: 0,
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    lineHeight: 1.75,
    maxWidth: 720,
  },
  productImageFrame: {
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    boxShadow: "0 18px 42px rgba(0,0,0,0.25)",
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
    background: "linear-gradient(180deg, rgba(10,17,40,0.92), rgba(7,13,30,0.94))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
  },
  solutionBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbe4ff",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 14,
  },
  solutionTitle: {
    margin: "0 0 10px 0",
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 800,
  },
  solutionTitleMobile: {
    fontSize: 34,
    lineHeight: 1.04,
    letterSpacing: -1,
  },
  solutionText: {
    margin: 0,
    color: "rgba(255,255,255,0.7)",
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
    background: "linear-gradient(180deg, rgba(10,17,40,0.92), rgba(7,13,30,0.94))",
    border: "1px solid rgba(255,255,255,0.08)",
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
    background: "linear-gradient(180deg, rgba(10,17,40,0.92), rgba(7,13,30,0.94))",
    border: "1px solid rgba(255,255,255,0.08)",
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
    background: "#ffffff",
    color: "#030712",
    fontWeight: 800,
    fontSize: 16,
    marginBottom: 16,
  },
  workflowStepTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 10,
  },
  workflowStepText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    lineHeight: 1.75,
  },

  configurator: {
    display: "grid",
    gridTemplateColumns: "1fr 0.92fr",
    gap: 22,
    alignItems: "start",
  },
  configuratorMobile: {
    gridTemplateColumns: "1fr",
  },
  configuratorLeft: {},
  configuratorRight: {},
  configCard: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.92), rgba(7,13,30,0.94))",
    border: "1px solid rgba(255,255,255,0.08)",
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
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
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
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
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
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
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
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  toggleButtonActive: {
    background: "#ffffff",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#030712",
  },

  quoteCard: {
    background: "linear-gradient(180deg, rgba(10,17,40,0.96), rgba(7,13,30,0.96))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 18px 38px rgba(0,0,0,0.2)",
  },
  quoteTopLabel: {
    color: "#94a3b8",
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  quoteTotalLabel: {
    color: "#cbd5e1",
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
    background: "#ffffff",
    color: "#030712",
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
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 32,
    padding: 34,
    textAlign: "center",
    boxShadow: "0 18px 36px rgba(0,0,0,0.18)",
  },
  contactBadge: {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbe4ff",
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
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
    marginTop: 26,
    marginBottom: 28,
  },
  contactPrimaryButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    background: "#ffffff",
    color: "#030712",
    padding: "18px 20px",
    borderRadius: 18,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 15,
    minHeight: 88,
    border: "1px solid rgba(255,255,255,0.16)",
  },
  contactSecondaryButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    padding: "18px 20px",
    borderRadius: 18,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 15,
    border: "1px solid rgba(255,255,255,0.12)",
    minHeight: 88,
  },
  contactButtonLabel: {
    display: "block",
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  contactButtonSubtext: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    opacity: 0.82,
    lineHeight: 1.4,
    wordBreak: "break-word",
  },
  contactFormWrap: {
    maxWidth: 640,
    margin: "0 auto",
    textAlign: "left",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 26,
    padding: 22,
  },
  contactFormHeader: {
    marginBottom: 18,
  },

  formLabel: {
    margin: 0,
    color: "#cbd5e1",
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
    border: "1px solid rgba(255,255,255,0.08)",
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
    background: "#ffffff",
    color: "#030712",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2, 6, 23, 0.78)",
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
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 32px rgba(0,0,0,0.24)",
  },
  modalBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbe4ff",
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
    border: "1px solid rgba(255,255,255,0.08)",
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
    background: "#ffffff",
    color: "#030712",
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