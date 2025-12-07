export function Container({ children, className = '', ...props }) {
  return (
    <div 
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({ children, className = '', ...props }) {
  return (
    <section 
      className={`py-8 sm:py-12 lg:py-16 ${className}`}
      {...props}
    >
      <Container>
        {children}
      </Container>
    </section>
  );
}
