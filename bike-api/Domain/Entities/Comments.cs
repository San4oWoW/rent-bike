namespace Domain.Entities
{
    public class Comments
    {
        public int Id { get; set; }
        public string Comment { get; set; }

        public int BikeId { get; set; }

        public Bike Bike { get; set; }
    }
}
