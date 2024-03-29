const fs = require("fs");
jest.setTimeout(500000);

describe("why - google.com", () => {
  const { Builder, By, Key, until } = require("selenium-webdriver");
  var driver;
  let testNumber = 1;

  beforeEach(async () => {
    driver = await new Builder()
      // .usingServer('http://13.126.196.198:4444/wd/hub')
      // .usingServer("http://username:password@43.204.238.237:3000/wd/hub")
      .usingServer("http://admin:57a4f614ebba7f86d71db9f9c26ed57e@localhost:3000/wd/hub")
      .withCapabilities({
        "gl:project": "The Grid Lab",
        "gl:build": "build_001",
        "gl:sessionName": expect.getState().currentTestName || testNumber++,
        // "se:recordVideo": "true",
        // "se:screenResolution": "1920x1080",
        browserName: "chrome",
      })
      .forBrowser("chrome")
      .build();
  });

  afterEach(async () => {
    driver.quit();
  });

  it("should open google search", async () => {
    await driver.get("http://www.google.com");
    await driver.getTitle().then((title) => {
      expect(title).toEqual("Google");
    });
  });

  it("should open google search and view search results", async () => {
    await driver.get("http://www.google.com");
    var element = await driver.findElement(By.css("input[title=Search]"));
    await element.sendKeys("selenium", Key.RETURN);
    await driver.wait(until.titleContains("selenium"), 4000);
    await driver.getTitle().then((title) => {
      expect(title).toEqual("selenium - Google Search");
    });
  });

  it("should open google search and do image search", async () => {
    await driver.get("http://www.google.com");
    var element = await driver.findElement(By.css("input[title=Search]"));
    await element.sendKeys("selenium", Key.RETURN);
    await driver.wait(until.titleContains("selenium"), 4000);
    var imageSearch = driver.findElement(
      By.xpath("//a[contains(text(), 'Images')]")
    );
    await imageSearch.click();
    for (let index = 0; index < 10; index++) {
      await delay(1000);
      let image = await driver.takeScreenshot();
      fs.writeFileSync(`out-${index}.png`, image, "base64");
    }
  });
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
