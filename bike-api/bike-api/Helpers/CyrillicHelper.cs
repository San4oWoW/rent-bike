using System.Text;

namespace bike_api.Helpers
{
    public class CyrillicHelper
    {
        public static string GetCyrillicAlphabet()
        {
            var alphabet = Enumerable.Range(1040, 32)
                .Select(i => (char)i)
                .ToList();

            //добавляем Ё
            alphabet.Add((char)1025);

            return alphabet
                .Aggregate(new StringBuilder(), (strBuilder, c) =>
                {
                    strBuilder.Append(c);
                    strBuilder.Append(char.ToLower(c));
                    return strBuilder;
                })
                .ToString();
        }
    }
}
