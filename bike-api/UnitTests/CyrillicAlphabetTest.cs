using bike_api.Helpers;

namespace UnitTests
{
    [TestClass]
    public class CyrillicAlphabetTest
    {
        private readonly string alphabet = CyrillicHelper.GetCyrillicAlphabet();

        [TestMethod]
        public void CyrillicAlphabet_ContainsSymbolsTest()
        {
            Assert.IsTrue(alphabet.Contains('ô'));
            Assert.IsTrue(alphabet.Contains('Ô'));
            Assert.IsTrue(alphabet.Contains('Ü'));
            Assert.IsTrue(alphabet.Contains('ü'));
            Assert.IsTrue(alphabet.Contains('À'));
            Assert.IsTrue(alphabet.Contains('à'));
            Assert.IsTrue(alphabet.Contains('ú'));
            Assert.IsTrue(alphabet.Contains('Ú'));
            Assert.IsTrue(alphabet.Contains('å'));
            Assert.IsTrue(alphabet.Contains('¨'));
        }

        [TestMethod]
        public void CyrillicAlphabet_NotContainEnglishSymbols()
        {

            Assert.IsFalse(alphabet.Contains('a'));
            Assert.IsFalse(alphabet.Contains('c'));
            Assert.IsFalse(alphabet.Contains('y'));
            Assert.IsFalse(alphabet.Contains('v'));
            Assert.IsFalse(alphabet.Contains('W'));
            Assert.IsFalse(alphabet.Contains('b'));
            Assert.IsFalse(alphabet.Contains('D'));
            Assert.IsFalse(alphabet.Contains('s'));
        }

        [TestMethod]
        public void CyrillicAlphabet_ContainsAllSymbols()
        {
            Assert.AreEqual(alphabet.Length, 66);
        }
    }
}