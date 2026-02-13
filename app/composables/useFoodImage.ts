/**
 * Composable untuk handle food images dengan fallback
 * Jika image null/kosong/error, akan fetch dari Unsplash API
 */

export const useFoodImage = () => {
    // Unsplash API (free tier, no key needed for basic usage)
    const UNSPLASH_BASE_URL = 'https://source.unsplash.com'

    /**
     * Generate fallback image URL dari Unsplash berdasarkan slug
     * @param slug - Food slug (e.g., 'beras-medium', 'cabai-merah')
     * @param width - Image width (default: 800)
     * @param height - Image height (default: 800)
     */
    const getFallbackImageUrl = (slug: string, width = 800, height = 800): string => {
        if (!slug) return ''

        // Convert slug to search keywords
        // Remove common words and format for better search results
        const keywords = slug
            .split('-')
            .filter(word => !['dan', 'atau', 'untuk', 'dari', 'ke'].includes(word))
            .slice(0, 3) // Take max 3 words for better results
            .join(',')

        // Map common Indonesian food terms to English for better Unsplash results
        const foodTermMapping: Record<string, string> = {
            'beras': 'rice',
            'gula': 'sugar',
            'minyak': 'cooking oil',
            'goreng': 'oil',
            'ayam': 'chicken',
            'telur': 'eggs',
            'sapi': 'beef',
            'daging': 'meat',
            'bawang': 'onion',
            'merah': 'red',
            'putih': 'white',
            'cabe': 'chili',
            'cabai': 'chili pepper',
            'rawit': 'chili',
            'keriting': 'curly',
            'jagung': 'corn',
            'kedelai': 'soybean',
            'tepung': 'flour',
            'terigu': 'wheat flour',
            'sawi': 'mustard greens',
            'pakcoy': 'bok choy',
            'wortel': 'carrot',
            'brokoli': 'broccoli',
            'kacang': 'beans',
            'panjang': 'long',
            'terong': 'eggplant',
            'timun': 'cucumber',
            'tomat': 'tomato',
            'premium': 'premium',
            'medium': 'medium',
        }

        // Translate keywords to English
        const translatedKeywords = keywords
            .split(',')
            .map(word => foodTermMapping[word.toLowerCase()] || word)
            .join(',')

        // Return Unsplash image URL
        return `${UNSPLASH_BASE_URL}/${width}x${height}/?${translatedKeywords}`
    }

    /**
     * Get feature image for specific food categories/types
     * Better quality images for common commodities
     */
    const getFeatureImage = (slug: string, width = 800, height = 800): string => {
        // Specific Unsplash photo IDs for better quality
        const featureImages: Record<string, string> = {
            'beras': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', // Rice
            'gula': 'https://images.unsplash.com/photo-1673791031202-ebc0eea03bf2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D?w=800&q=80', // Sugar
            'minyak-goreng': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80', // Cooking oil
            'ayam': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80', // Chicken
            'telur': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80', // Eggs
            'daging-sapi': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&q=80', // Beef (Updated)
            'bawang-merah': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80', // Shallots
            'bawang-putih': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMWFRUXGBoYGRcYGBceGBsYFxUXFxcXGBcYHSggGBolHRcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICUrLS8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAFBgQHAAIDAQj/xAA/EAABAwIFAgQDBgUDAQkAAAABAgMRAAQFEiExQQZREyJhcYGRoTJCscHR8AcUI1LhFYLxYhYzU3KSorLC0v/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwQABf/EACcRAAICAwEAAgICAQUAAAAAAAABAhEDEiExQVETImFxMgQjQpHB/9oADAMBAAIRAxEAPwAZc4rKJJpdubpJJ1BBpyubBtxkJgCkzE+nwDKSaM7LpgoMtIOcV1bdcdJMwBQ55lWbKRTJ0lhDjjiU5T4c+bTiodCa4RYLcMBJjvTYxgSEjzKFGsSQJShtISlI4G9Rr9tBQBqCNzTQjGvB7BruGIHANY1hbauKjIzDmam4VdgLANCS+YhpGwwBPAr1PT3pTzbBsgbV64tsGI17UrzOCtsRQUnSQtLw5bWVRalO2c8Hg5e3vQvEL3w17iZ9KsS+UkpKp0AMDkGI0FJn/ZsQXV/bVqfTTissNpS9s1yaUUHcBxSUA6H46/KmuxuArj3qsEWrjKgYkHY8exqwunHioEqTlMD2NaopGWafoeCxFD3kA5pOlSXRAoVfLqgkUDsRuwkFKdTxSX1M7DISvlQ0+NG79BWreIqtsfxRS7jIVaIMAeves+RtM3YoxS/sujo/C2vBSoITJG8UWvcMBBy+U9xSv0JeqDKRMxTw27Ipsc4zRnzwljnYqWN4tD3huwJ0SqND79jRa6uPLpJnTT15rTF8MQ+CmRNIl45iVspKEpLiAdNPNA4zbH33pLlH+UOtZd8YzYm96/s1wwlZSXF69wPQDT4Uh4vi+Iuq/pMPgSRHh6+hmKkpVfKslIUFl+4X4aUxlKW29XFq7AqhMnt60Lb6PcVwsPqe3CmzyKovqd9Tea3AOUGCf+kapHx0r6ARZKFs0hWqg2kH3CQD+dVl1ngjgSp1tKCUAlWdJV5E6kgA7ge9WaZGEv1ormwuSE5Y3o3gtmpaxG/I9K0tC3kBBS4SJBLeUHvl5pn8FVulDhSAFjTLRWNX0r+GdXHocGVKQnsKH3igAVA7Coi7/OInXg0Nu72EqSo6nStGSS14Z8cGn0WFugKUoq5NRnHQozU13p1ShmCtDtUe4wNxEAq32qKkh+h7pqyQ8Sgrggcb0wDCA1ACpH41XmFKet38xMevFWh0ohb/APVdVIB0AG9JOTitgR/Z0c2myRJKhqdIPBIrKYXMXQCRkOleVG5PuxWl9FffzChzpXQrzDWtk2JmO1Y8jKK300umWyf03atkn+mFKnc06sWKVAZQEEdqA9HWmVJWrY0xWjxcVDf2Rur8hTx8FknYOxK1WEkJAKqXBiqCShzyqHBpzxFYSoAfGkDri2EeKhJzA/Opyj8oeFs6PX7KFBETPaod+lOcKQaH4e26UJeABSdCDuKZmrBKgDG4qLTaK1R16fW844JV5RxTObB3Nmz5QON/xoZ01blDhT6TTWpqd6RY7XRXOnw1tmsyY+tbX9t5YqXbAAVtc6irwhGK4QlNti1ZlKpZc+FMmF2uRGXNm7e1KuKokSnRQMg0R6cx0L8i9Fj6+1ScldF6bQxuEgUDxFZPFFX7kRNLeKYmBNdJ0HFFtkG2wt91ZDaYH9yiY/zQp3+F76sxK0BajObXTvVm4M4ktoI2IB0ogsjtQUU1bDkzy2pCR010s9aphTqVj0BFMBu8uhSpQ9I/M1Of2oY66AYPPHNBY4x8A8sp/wCRPtLRqfESiCrcydfepjjII129aX77GfB8rbanFf2pj6k6Ch6sYxNz/u7ZkJOhzOmYP/lFHaK4hNJvv/p06huip1LDSso3Uoemp17Aamplk2HCHCITAyzuoDYn05jvUTD8KUVZXIBKRmAkjKDqJOvmP0Se9MD0JT7VLDBtuUi2SSSUYnbxQRHag9/bga8GQf8APvrWYe6SVH3re8CgZ3BGorUzMo0xGwnpG1RcFpbSwgHMy54hKZVOZBTHljiZFHMc6fU20cpDiIjKobaRxRBIiYGnatjiMeWZHY8fpSL6L/kknaZT+I2jzS1EJlsgwRrlPE8gUrS+pZLiSPT0q38cZyqLidjuOKX7jKFAgDKRMfkKardFMj3jsBWVFLSde1a4ivM8wCQEkfWiOIW+ZMpEcxS0ozdJUo+VCfrSJU+iNM96iUlKiKe+j8VSw2lwgqTGUgesaj5VXeKw6+Ej7x3pgu3k2tqNzrEfgalkVqkdF07YfxXqVpTq1JgAnQb8dxpWUqWuFZkJVO4mvKzaf2W/IxuxRYSqO9Cbt0DeoeKY0FkGg97iwIia9ecjDHhZ2A3CFtBI2iKa2MjbcAAQKofpfqdTTwSZyE71aL2MBTcg6RQU00M1sTbZXiuE760P6zaAZUPSp+BIyNF4nfWk7rLFzlUO9JLIqpDQi9rJWFMAWSBydak2TuQhJoThd4QhtPATXrt35waS+lX4N9hcJDmbk6U1W6kxJqn8RxJaMq08ESKfMGxpDzQUDxrTRZnlENi4lR7VKcX5aAW98kK3oobkEb0b4Lr0BYm5BgUDuG4OYGDTW7Yhz7OnrUJzpML+098E15k8WWcrR6cMmKEKYCVjykpjPNL74vb1wtMTl++ocDtNG+pejFNgqaWT6GoH8N7m4addbUcqSZiNe1USmn0nJxa/UsrpZC7e3bZcOqBAJ5A9aMfzoBGijJjQE7+1LF7evQIg5dQfTmmXDsUQtAINVx5NuEcmOlfpLWgnYfE0FxVxCFSNV1PvcQgafIUFVbKUqVf8U8pXxCY4fLI6CdVHmp2G4f4slRIHoSD8xtUO+eShMVO6MuwtLgB1BH1Gn51HXaST8LybjByRJsVkXLw1yhCEp/2lU699RRG6RLavUVo8iJ09a4/zOhHp/itEFqqIS/Z2iLgfmPcwSfpvUrEGSZ9B+s1C6S0QsnfNl+Q1onevAfQfPSqJgfJ0gVbPaifj6jY/L9aA9RsFBKk6H3/GpuIvZDI0KfMPxqLi90FNBwa6aj07e80B1HoDN+VtlJ1oHfqylKfQn5/s1KeuUMpUtxQAGnuew70C/nVOOFZETsOw4Fdtcik0oxpfIYZMCkvH3Sw6QoeU6gjmmeSdMwHwmoXUWHpcySSSBzXTSsCvSxPQ+Q8l0/ZG1WEt1Ny0JjTiku+w1tA1PsK3wq8cQdjl4pXERMcUFSRlCNBWVGTjSoGlZQ4NQm4/brQSpJ0oRboKjqSfSnTEbfxBkG6tKaOmelEMoBUgKV3pmyFdEnD8NOnkPyprwa1cWpLYmCfpUrGMyXQhKYnsKaen7Dwmy6v7R2qStukO1qiTjDwbbDaeBVSY7dh10pnypP15p06nxPKhSp8x0FJNphniKASCVKop3KzvESGsUSBA7Vls6pZkU3YR0CgQp3U9qPpwxpsQlAiqqP2DaxAu7ZYbk0Ftbt5hXkVoeKs7EcIS6iAIpJvMLW25CkmODFdNHI5sXtysgmQTt71Z3T2C3HkLpkETHr60o4ZkcdZRpOdOntr+VXG0qNKGvQSk0D12+UgFOleuWyQiU/5oi+dPWhlzcJAjY0wuzYLfM6KpN6iaLC0up011pwvBI03Go/SgmPNh23X3j6ioZEacbISsUK2wUn0o3YZUgZT71WJxLw20AmNYpgwbFCTvUYqrbK+8Q+JxNDerif8AduK4XGPtR5VZj6VDbeC0lKtdKBOtBKjFUvnBFFWc8fv15FLmKeemMNDSUuoVIWkZvxB/feo2GdNpyhTiQtR1g7D4cmingBAgGB2G1NGFdFyTUuJhd8giaBXi8p+etRr7ElsiU6p5Hp6UodQ9RuLlCEb8zpXOQMcGv6G/py8jxmyZGcrT7FIkfOfnW2LXnmInjNzwZ/IVVCbp1CgsEpWPvA/vT0psw/GEupSXXQHNtEEykj33opt8HWqlbO3UV3Oo2MfHmKCnFAEZFKhKQpR9yrST2H503NdMMrAWXFOegIA+QE/WubrDXiJbUhIHEAR2GldJyXiCpx+Cq8TuFXBhKTkTqCQRJ5MH2FEsOtVKRmA9xVg4xhLaClcaDiBFDri6baC1FsFGUkgaGe4NKtl0HJOwEw1lBUSABrS5fXalLKif+KnIuGHmPEU/lczq8pPHAigl/eIQkEnem22YJviRDuLRTr3/AEimuztG0IzL0AFadLYeXVDLuqrIe6WaWgJUniKtGaXCWqE9nDrZaQoEQfWsrle9BkLUEKUEzoJNZR2iV/EvsE9LYW9cO+KNEAwJqyWbB1KYkUL6bU3bOKaXokmUn8RTLeYqiIbGY+lIkq6Zrd8FW5t1m7bQVDzGIA4G5Jop1RfBCcidhpS69d5LqXVQuCRHA7e9CcVxBTnO5qcpaqkVat2wTjl34jgHApz/AIc2KcinlCTMCq6YfSp5aSddqtL+HaIagmRmNHF6LLqGS4WY7UMceJMDX0otirgAgUNw21KiT21rVTJqqsJWtrnQCRlPaoN1h68wkBSaKpuAnQmu7awrRJB70raFTYn32FtoeZeAyLC0+xkxFWJpGtJnVyV/0kIGji4Jjbnfim+1SEoSCdYjWpL1jy8TPXVADSSfagd00VGTRxwHvQu5cSmddaLOj/AGcdGaJ2qBilqpTa8u5B+dbpcBUTtrvRdu1kBW9SbUjR/iUi9h6lDK5IKVazUu3ZU3BQZFXGvC2lmVIST7V1bwFj/w0/Kl1+AbIT+gnlvvgKbJQkEFXAJGlN1h0wlDynVHMJOVPA1qfaW6WElLaQJ7d+Kh277xzlwzB0jcnaI+IpHkjDlHayl2w8eEiol1an2qQh6IG5I2/Oo17crSCYrSnwhTvgDxFkAHeq96oZU0PFb+yPtDt6j0p4xLG9cuQ7fa0j270t4hcJLawoaEH8KSetGiCl4xFvMZK0RAHrXbpy/AV5jtQ4Mg1PtulrlfmQMvYn9KaKafBPSw7DHCgSNQdxXPE8XSsgp0IM0pqw29aR5khQ9D+tBncXdnKEwZ1mmk+jUkXBeXCHWU+YTGtJnUaHH23G2SIQBm7me1C7J99YgmKs3C8KaabSmAZElR3J5JNRnLXo0fKKKuOlXMkwpJFAmmV+MlDs6d6ve8QhRUBqOKU8b6eQ5JAyrGxqkJWTni+gl0IUJcClHKAKsxF82YCVpVPrVKYM079nMAUmnnCLF2ErAnWZBqjSfor6O3gjtWV6h4QJrKlYOiD1HAMHSdj60IwTGvCQpJ1V3qI0F3qjcBUJVqJO3pFe4phYSQoH/mhJtuxkuA/FrguOZ+a5WGJFRUktzl+9XK9SUqHr9KkdPteVQjUqM0ipsddF9zCHQ6pxMeYkxTt0TjWXOyrRW4/OvBZkCaW7i78G4Sf7jFNbTA0kWm7clUCj9msIR6mlbA3EqInWIptdy5ZMVqhLaJDIugjEXIJAOtHcNKQ0MoiRqeZpZu3ETodaKYJeSCiNqlKC2sfup51JiKWW0rUdlpA9yoCpuC3fimSZG9AessNU+yUJQVZVBQHeKA4Rd3dqrVpWU8cgUrdDRSlGh+xpayCGlZT3PHfSlDEjcgEB0E98tTLjqZvLpOb+0iD8JpRxHqlAJUqUD1GtZpTt0kascVFdOV8y4SfFdWQBJykJSKHN9TXCQlFotxYB1UrUEDgTvWln1It99IaSnwwdQtIUlYIghSTuKtjDbK3XDymUpWYzZfsk944NFY3VgyZE/PCbhjq126HFgJUUgkfCl+76tcbeLQbzRGoPeme6um4CUqT2gH8qR7lA8Rat9fwoStNJC40ndoeMijqRx8daHYcwfGUjMSEZVFRg5pSQQCO2m9Y1iSiwh8aiMqh7HipmDNpKJHlJMlIjyk96jLH+yQ29RYXtlpnQemu+leYpcgCNj7VgaUVkhUcRH1oRjdq4obg+yoP1H51vi6RkUYuXWL2KXaZjSflS91DhzhtnXJKSEk/AaxHrUy6tVoVJZUsjaVpj5il/GMaunT/LOM+ClYgwZkTwqhMvxeEDpDDVOKCyNOKtOywQhOZU7aDWs6MwJAbBGhGkaRtTNcsqA1XFOlSIuaXBPvvEQO6ex/zSji1igq8XKB39qecVGhlzX6UrYi1oE8L0MUHxFE0zWwQ2U6VMZdUNiSBxxFLaHAyvIFEj1o83eJSgTuaMdX1Cuz1z7eYaVJUyFCajWaC6ZTsNzRJvD3FCE6e9M2mMotCV1CkMqDgMAnWieCdUFAASZT2ohjnSgeQUuKMcxp9aWG8ASwoZHFETqCJ096VK/QuLvhYLeMtkA5omvaSVW4JnMoVlLqg0/oR8WeXZPlpl0qRM5Z0Bnai+F9Rl5aUuaAb0M6psNljmgzCFCun6Z06HfFMSb1IotgbKQgL4VrVd+IdjTXgPiPlDYlKEjUiljHpRzC9/iIToD8KBK6cuLlwOkZUgyKb0YCy0oOTn15pqsVNqHliO1aI4/slOQkYW280+kHUEaj2GlMt5iJiNYrWzaIdecWAE/ZR7Dc0rYwpwSUqNJJqPEPB36GWrkE6/KnrCWkeEkgaxJ9aqnBMVbUsNO+RRIAVwrXY1clqyEoAG0UtnZGn4di1ofal2+uACAaYHlSmBQF7C8xzTt+NTybPwbFqvQDi9q24kgjfkbg9xXDBOgioeJduFTf3WoAMcFat/gKZcOwnO6FEeVBkjueBTLcMSn4ihCFu2HLkS4hdtOl7JhEpt2k9oQP+Sa43mKNoATCkp2Ggj5TP0psdtUmJEga/Shv+mpJMpBHEgVZxJwyRXop2900sqWhKlZIzFKCEpnQAkxJ9BNc721Kl52wMp0OvPejPU9wEICE6ajb9+9D0OlKAVafv/ipPD8l1l4DGFKY8qtUKOw2k96O2T5QSsKBO402G0HvpQi+XCgR9lXyml/EMWVarRmMlajt9kJ7a/vWjBL5BJWXAh8BAWTIOsj1oDit4lc5XUT2Jg/I60vYb1IoJynzNnbumfxFD8SSpZlMKT++DqKaQcWL5J/gkLlawAN/3NL+I4s3dXLbVunNkJ8x0zK7D00qZdvpbYUYhREAHvQvoSwAuW1EzKp9OTUW3LllJ8LYwFhbbQSR5jqfT0mpz1sSNakMkV0fUIq68MTl0ScaaQnXzGfU/hSwSTI1EGabscc110FAGUCSdIpWa/8Aj0TcZbIcnYmSIHYd++la4CVXCtT5RpRDqh9LaPEny6CDuZ2j60S/h7hmRgOrASknQcnWflSYX9k58HfAsOS20kRE6x70RFvzt61xsbxKt1Canhkq5EdquQcmB7nzbbdzz8KVsbtDqZ+Yj86fLi2EcmgGLsJymE/v5UVY8ZiH4Z7isrs+yMx0O9ZQ0NayCxjQBZM8Us2xmifU17kBSOaAW1/l3TU52/DFyxhw3C1OOJE6EirjwqwQ0jypA0g1TeE48kKTGip0q5cC/qsgrJkiq4rfp2RvhGxHCfFSSkFJ3HvQ7CC7nIKFIUn7RI8p9QadEqCRG9CF3xdWsJA8NIgnurt8KpJc4TUgZjRCE+JJ4BE6EE6/Gk3HcXE+Ek+5qfjN4rOATmTm+ldrrCG1omBrqDWVRZqTSYM6WNuXglxOaYg9jO9Xd9wAbRXz6yyq3uArdE/Gr7wd3xGkK7pFFJiZGrtHVEDU0Dvnih1Sk6BXHBjn3ozf3KUDUilm4xLNplMTuR+FJOdcGxQb6NWBqzMhYG5J+RipjrmlC+l3P6R7BRj460SfEaiqRf62Rmqm0dVuafCvTAFDP9QRyrSSJ0jSJ+HFd3XwoQnU1yyRfjFeNr0XLm1L1zt5U/jQ7qVYHlGw0/U01BAQkwNTPvrShi1it1emiRrNVUvgpH2yEl4ZQnvSh1faLLgJUSkJkJ7d6ammwXNNQkRPcnc0PxIpW+pB4SPrUp0nSL/Fi3g2JkCASRtRtWP5BqkfnSy5h7ls6pIPkUZBPrU5izK9eanTYVN0a4lirrxHkBHbipdgh1IS42PDCTJCj5VcjL61Ow3BTMmnTAsLTnJygkQBPAjj40GqXgl2MHT2IeOwhwciCOxG4omtlRH+aGs3bKXQwlaQ4U5sumomKILcUODTQfCcveAjE7AQSs/AUqPvjPlA+H60zYq44QQEn8PqaUVNFpUqIk+u1Fv6NEFzpzxbpFd6tqDlSHAVK9OYHJprxDB/CbSEkeGmEgduB70odSdXrs2G1tqBIcSQnTzDMCtMmYBGk+tOeGYoL9lKgktoVrEySZ2JHH60qTS4SlyXQCt1Tap7Uas8VJEkwairwe4tFeK2sPN8oUOPbj3FSrS7t1r+wEynSdII3BGxNXhl+JE8mO+xDFndKWklQ04NDcVIgyD8NalvXYTpsKB4nepOhiuf2dCPRcuFNZj5v/bWVBuX0BRHjAa/3Csrt0aNV9lXYzdZn1cgEgfA1o0AeK3xBJU8spSYUtRAA4JMU39MdJFwBSzHpU6bfDMv5FLDmVB1Jy6A1duBYmkNJg6xS/cdKpSPLoa2t8HcSJbXqODtVYt2NKSkOGZThyiY3UfTtXj7iR5UiEihNjjiUp8NZhY39fauSMRSp3LOkVXZCaMgX1uklQPeudtiIQghWwGn6Vzxa6AUSDQa8v0ASSB3qUpJeGiMPs6M3rb6kqH9wBB96uvBVhCACNI0r5psb+FrybTIq8ehepUXDKQT5gII9RU1ITKk6obbvwyOKWMXUlIJmKLXpTG8UDuSIMnQVDLIrgiRun+sGGnfCUqUqMZvuhXAmnx9xKk6HcUl9K9PocUbhSQdTkGke8d6cSxlGlNiT0piZ1He16JOFvul15vMPKopQFmVRzKhyZkVNZvnUkpXAOZMnkiDm9tcpEdq7Yky2F+IISskBXqJ3P6+9Qby4ShHiHMr0Skkkjj51jknB0aVUlbDFpjCFqSlzQKTIJ/u5STtO8DnKaj47eDKUoGvtpSo5bqXlyZiFKSpRMwnwyqAkf7lb9qJYliCW0+dyfh5vlWvFkbj0hLGlIHIfyJUpWwlSifSkXp7FlO3Kws6rUVJ/wDz8q59XdRrdBZbGRH3p3V+goF0u+f5poqP2VA/I0/fTpO3wuTEOn1OsyUEcpJHP6Us2jKkEgiCNDVy2DwdaE7xQq4wdpKytSARG54p/i0SUqdMr69xJTaUIQMzizCR27qPoKccISfBIUYJ+0oHXatMEwlt1SrlQSColKNB5UJMCBxMT8qYThaSNIB/H3FLTl0aUlFikOkrVRD4W6lzdLhWrN9dPhWW2OX6HCylKblCRPiJUkGOytYzUZxNpRBa8RbfcpynN6DMD8696fs/DzCAEq1OnIEH9a5Q+jnONWKONde+GSh1lxtY/uHl/wDUNDSZfdZMGVKKlnhKNviatjH7dJI0Ck8iOD3qpuuujEIl9gBI++nj3FGq9G3dfqJeMYq5crzK0A+yngCru/hBivi2eSIU0rKfXQGfrVSWGEjQ/a9OaYunMfdtnFqQjRMSn+4T6fGhsiVP1l+lcigd5h6ZJT5TuI4POnPt2pbsf4hsKSColE8Got/100T/AEjnMgdhqdpNdNbDQ4EMTxfJ5XELB2BSlSkK9UlIMexqExhTj+pKm0HedFR2A4NE8JuPGBcIKSATkP3tSNuD60VsHwhCQ5GaJI7D1pVKT4yrVeG1rh1u2hKEoTCRFZQu56iGY5dp00rKNg/GxOwLpYBIJ1J1NGP5QtEFOg7UctTlQAO1cHiTuJrdGCRkcz3xwtEHfvQ9pUEjvXq2lCcuo7dq9VbqykjfehKPydFi5jFh4xkGFDkUo4lePsLide9WM9hzqQV5ZHPp70mdW24UieQayyZornAOMVcc0Ne/6SXTKiTUFptY2NS2MVdQDtpSxjKXg8Iym6C1l08lI0FErDDC0czaik+lcG8QcFul2NSdql2j9woA5RUnsdxBoY1cAQog1qxcOOrSg/eIHprWjFm6rcAfCjOEYcUOoWSNCOKTVt9H2pcH7DLINthCRoBXS6XpUlhQia43REVrXhiu2LV22lSvNrOla2rOQx8RWYkoZtNa3tnArQ1NqzRbSIOOoWskoJTA40pEUySslZJ96t5iyBBPFQ7npVh0SUa+5H4V2joVZUvT58xy0hwnvQ5q18NYXO2tfQif4cWhVmWgK7AlZ/FUfSlPqzp+zWossspbyeXMnSVckxvSNuK6PF7OonXo/rlGVIWqCBFOyMRafBOaQRon17mqqwz+HqS6El1URmIBGw4mjTaXLK5aSkKWypYSNZICjG/O9cpxfAuD9ZYdrY7SoBPYChbuPpYcWM3iIH9pBI7+WZMelT8QtfHypzuJSnUhGmaREE7x7UHxLpMESl51tMRAyQPbSZ+dPbT4dFY3/mT04vbuhKkrkK2lKhtvqRRa2b00II9KVcCQu1KbdSlqQoqLalgTpqpOnxO3Jote46lpxpkBSlOKyyjKcpgqgztoCdjtVNuWyOSKuohR2zkRoARGval7EcIaJUysEpIjUmSD7UxeIhAgHUCTJM+5J39zVfdXdfsNr8JBCnRzwAe/f2qM5N8GxxYh4jh4t7t1pAUQDCcx1AgGJHGtT8KwcqMKzAHWE7fEmu5eS66HCQoqEk8mmmyiBTwxbKwzuLoD23TSQrMQk9hG1cL7DG0mSgaGQQNiKdMPtgtYTMDmuWO2KEzp++9Vl+nBYRUgPY40StKgUygHyn70iPlWX2IKcBzKSJ1MGg7toBOmhmlPptqH3SVaAECT61B22aV+tcDzvU7CSUyTGkgGK8qZb9IsqSFFxEnXcc1lLS+xdpFh2zJjgioN+0RqmutreaVwvbz1r0Tz+2eYYMyoNNLFilIk70j2OKBK5n0oli3WKGkEkEwJ+lSyS5Q6g2zj1FiSWE+ETGafMdgOfc0lYmErQdtaCnFl3LxU4olUyOwG+X612xm58NoqGo7VkSNiSSAtq2omKmKwBxY0I1oXYYq2k6mmuzxhmAM29dFzjdIbFJq3El/6erwm0D7p1ozbeUCRUE4m0gwpcGpLeItH74qLcjuBRrEW07g1KtsdYzpBkSQKEJuGzsoGtihJ4n4GgptfA2ifyWe0zICknTtXC6YVydKXel8VWqWSVAjYkHb3NMyLc8mfetaakjNOMscqYIcsxvNc1eClKs6gBzB1+mtSb+xSSM6zBnQGKDXNs22fInT98mpTbiVxpT9YMwTqRLN54LKHHGCNVHN5T/b/AFDr/tp6Z6iaUYCHZ9W1gfOIpGKwlZXoT3/Ko7+K3L77bDTpQCZWU/2jelWRjS/06fSyzfk7JI99KT77DGmczjiirUqgAEkk96arOw8okk6cmuV5h6CDpNNODkrZGEowdIrrBvHVceKBGsido7H4Uw4y+3KSSPKtCj3BBE12bsQ2omNK8fw5t3Olf3tQr/6motNI0JpsYrdeoUBJ47RWP+ZQzGfT97Vxw1aUoTGoSAJn+3T8q3VelZhKR71qi4sySi7Fzr1jOyhxKVqLK8wQ2YK5GUpzDUJ1EntNIdisGbl6UOvKyZmlRlaTMNtH7iCQNt496t25UhsSoyo/WqvxPDP5u5aS2fCAWSMqRASJOo2if/lTUmyuN/o7Q3YW34zQAcK4ESYCo4JiAaV8c6WQsLKxqF5SDwnKCkpIrhgWLfyl8WXJCFE7fZJncfviieM4r/UdB2Vlj0yzHzBPyrnFUGG21FdItCw6ESSNYJ7cU+4a9AFJDz5dfngaf5p/6ew/MjxFfZGw7kb1THJJWxckbYx21vkQHeT+FQ8XuAtE/OiLlwFMkdhSHi+Mpt0lS1TI0TyanklZ2KNHLEn/AA2is8/ZHc1G6UwVC1EqgRqZG5PArOnsOdv3EuODK2NQngDt6mrYssNbbTMDQQNKkr+CkpK+iz/MBPlTblQGxCNDWUeWpyfKmBxWUmg/5P6/7K/wi8cdbQoR5gD86Jm1JSSo7VlZXo/BgvoLtlBSyBwaVOsMSJKgOTlH51lZWeTLRIVojLLveB8q9vLoKGXvWVlTfhV8B79umNhXSwSFPNp9aysqkH/tsvi5ikOzWHtuXJzJBgCmmywhnhCaysrMnwztdGHD8JbTrkFF0W6B90fKsrKAD3w08AVGuHlp9R71lZR2a8Ckm+gC/wAUKlpAGs1wxi5J0FZWVybpmpwSaoWMRfU3KTuNfia6dBuKN2VK2KdPnXtZUrqQX1FvtO6VrcanLXlZW34PLapkS7thFBlsysgGKyspZRRXHJ0DsVfXalJ3QoiRzJ7Uct7pASFI2ImT7VlZWfG6k0jS1tFNiz1BikkndR0HoDvXOzaDSEq++Z199f0r2sqljNLwTMadSBqJKRoTvMnn40FvMTW5pOnJ5PFZWU0mxJPprauBOtWDgeOtlhLYJza8HevKyl3fgEiS247lIEQarvr3DV+IhziI3rKyjfRl40Wx0QUKtGVJEAoH4UfddkxwK8rK5eGd+ngdFZWVlMKf/9k=', // Garlic (Updated)
            'cabe': 'https://images.unsplash.com/photo-1672239927784-7a5e8bd03d58?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8?w=800&q=80', // Chili (Updated)
            'cabai': 'https://images.unsplash.com/photo-1672239927784-7a5e8bd03d58?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8?w=800&q=80', // Chili (Updated)
            'jagung': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80', // Corn
            'kedelai': 'https://images.unsplash.com/photo-1639843606783-b2f9c50a7468?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2VkZWxhaXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80', // Soybean (Updated)
            'tepung': 'https://images.unsplash.com/photo-1611862778160-31d3eefa2d98?w=800&q=80', // Flour
            'sawi': 'https://images.unsplash.com/photo-1638202993197-02aa27419183?w=800&q=80', // Mustard greens (Updated)
            'pakcoy': 'https://images.unsplash.com/photo-1616147417534-11918997a47d?w=800&q=80', // Bok choy (Updated)
            'wortel': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80', // Carrot (Original was good)
            'brokoli': 'https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJva29saXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80', // Broccoli (Updated)
            'kacang-panjang': 'https://images.unsplash.com/uploads/141143339879512fe9b0d/f72e2c85?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2FjYW5nJTIwaGlqYXV8ZW58MHx8MHx8fDA%3D?w=800&q=80', // Long beans (Updated)
            'terong': 'https://images.unsplash.com/photo-1604321272882-07c73743be32?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVyb25nfGVufDB8fDB8fHww?w=800&q=80', // Eggplant (Updated)
            'timun': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80', // Cucumber
            'tomat': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&q=80' // Tomato
        }

        // Check for exact match or partial match
        for (const [key, url] of Object.entries(featureImages)) {
            if (slug.includes(key)) {
                return url
            }
        }

        // Fallback to generated URL
        return getFallbackImageUrl(slug, width, height)
    }

    /**
     * Get image URL with fallback support
     * Will return provided image_url if valid, otherwise return fallback
     */
    const getFoodImageUrl = (
        imageUrl: string | null | undefined,
        slug: string,
        useFeature = true
    ): string => {
        // If image URL exists and is valid, return it
        if (imageUrl && imageUrl.trim() !== '') {
            return imageUrl
        }

        // Return fallback image
        return useFeature
            ? getFeatureImage(slug)
            : getFallbackImageUrl(slug)
    }

    /**
     * Check if image URL is accessible
     * Returns true if image loads successfully, false otherwise
     */
    const checkImageUrl = async (url: string): Promise<boolean> => {
        if (!url || url.trim() === '') return false

        try {
            // Use fetch with HEAD method to check if image exists
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors' // Avoid CORS issues for quick check
            })
            return true // If no error, assume it's accessible
        } catch {
            return false
        }
    }

    /**
     * Load image with error handling
     * Returns promise that resolves to image URL or fallback
     */
    const loadImageWithFallback = (
        imageUrl: string | null | undefined,
        slug: string
    ): Promise<string> => {
        return new Promise((resolve) => {
            // If no image URL, immediately return fallback
            if (!imageUrl || imageUrl.trim() === '') {
                resolve(getFeatureImage(slug))
                return
            }

            // Try to load the image
            const img = new Image()

            img.onload = () => {
                resolve(imageUrl)
            }

            img.onerror = () => {
                resolve(getFeatureImage(slug))
            }

            // Set timeout for slow loading images (5 seconds)
            const timeout = setTimeout(() => {
                img.src = '' // Cancel loading
                resolve(getFeatureImage(slug))
            }, 5000)

            img.onload = () => {
                clearTimeout(timeout)
                resolve(imageUrl)
            }

            img.onerror = () => {
                clearTimeout(timeout)
                resolve(getFeatureImage(slug))
            }

            img.src = imageUrl
        })
    }

    return {
        getFallbackImageUrl,
        getFeatureImage,
        getFoodImageUrl,
        checkImageUrl,
        loadImageWithFallback
    }
}
