import test from "node:test";
import assert from "node:assert/strict";

import {
  defaultLocale,
  getDictionary,
  isValidLocale,
  localizeHref,
  replaceLocaleInPathname,
} from "./i18n";

test("isValidLocale only accepts supported locales", () => {
  assert.equal(isValidLocale("en"), true);
  assert.equal(isValidLocale("th"), true);
  assert.equal(isValidLocale("sv"), true);
  assert.equal(isValidLocale("de"), false);
});

test("replaceLocaleInPathname keeps the route suffix intact", () => {
  assert.equal(replaceLocaleInPathname("/en/about", "th"), "/th/about");
  assert.equal(replaceLocaleInPathname("/sv", "en"), "/en");
  assert.equal(replaceLocaleInPathname("/", "en"), "/en");
});

test("localizeHref prefixes internal paths with the active locale", () => {
  assert.equal(localizeHref("/products", "/th/about"), "/th/products");
  assert.equal(localizeHref("/products/society-hinoki", "/sv"), "/sv/products/society-hinoki");
  assert.equal(localizeHref("/en/contact", "/th/about"), "/en/contact");
});

test("getDictionary returns translated navigation labels", async () => {
  const en = await getDictionary("en");
  const th = await getDictionary("th");
  const sv = await getDictionary("sv");

  assert.equal(defaultLocale, "en");
  assert.equal(en.nav.shop, "Shop");
  assert.equal(th.nav.about, "เกี่ยวกับ");
  assert.equal(sv.nav.contact, "Kontakt");
});

test("getDictionary returns translated page content from locale dictionaries", async () => {
  const en = await getDictionary("en");
  const th = await getDictionary("th");
  const sv = await getDictionary("sv");

  assert.equal(en.home.hero.title, "Made for slow mornings.");
  assert.equal(th.home.hero.cta, "เลือกซื้อเลย");
  assert.equal(sv.contact.hero.eyebrow, "PARTNER OCH GROSSIST");
  assert.equal(en.emailFooter.links[0]?.label, "About us");
  assert.equal(th.emailFooter.supportEmail, "hello@blachh.co");
  assert.equal(sv.emailFooter.links[2]?.href, "https://blachh.co/terms");
  assert.equal(en.product.tabs.items.length, 3);
  assert.equal(th.cart.title, "ตรวจสอบคำสั่งซื้อของคุณ");
  assert.equal(
    sv.banner.message,
    "Fri frakt vid bestallningar over 800 kr · Forhandsboka nu · Skickas inom 7-14 dagar",
  );
});
